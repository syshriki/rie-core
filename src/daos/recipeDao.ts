import type { Sql } from 'postgres';
import type { RecipeEntity } from '../schemas/recipe.ts';
import { optionalTransaction } from './utils.ts';

type RawRecipeEntity = Omit<RecipeEntity, 'ingredients' | 'instructions'> & {
  ingredients: string | unknown[];
  instructions: string | unknown[];
  isFavorite?: boolean;
};

export const create = optionalTransaction(
  async (sql: Sql, recipe: Omit<RecipeEntity, 'id'>): Promise<RecipeEntity> => {
    const [createdRecipe] = await sql`
    INSERT INTO recipes 
      (username, title, description, ingredients, instructions) 
    VALUES (
      ${recipe.username}, 
      ${recipe.title}, 
      ${recipe.description || null}, 
      ${JSON.stringify(recipe.ingredients)}, 
      ${JSON.stringify(recipe.instructions)}
    ) 
    RETURNING *
  `;

    return createdRecipe;
  }
);

export const findById = optionalTransaction(
  async (sql: Sql, id: number): Promise<RecipeEntity | null> => {
    const [recipe] = await sql`
    SELECT * FROM recipes WHERE id = ${id}
  `;

   return recipe as RecipeEntity;
  }
);

export const update = optionalTransaction(
  async (
    sql: Sql,
    id: number,
    recipe: Partial<Omit<RecipeEntity, 'id' | 'username' | 'createdAt'>>
  ): Promise<RecipeEntity | null> => {
    const updateData: Record<string, string | number | null> = {};

    if (recipe.title !== undefined) updateData.title = recipe.title;
    if (recipe.description !== undefined) updateData.description = recipe.description;

    if (recipe.ingredients !== undefined) {
      updateData.ingredients = JSON.stringify(recipe.ingredients);
    }

    if (recipe.instructions !== undefined) {
      updateData.instructions = JSON.stringify(recipe.instructions);
    }

    updateData.updated_at = Math.floor(Date.now() / 1000);

    // Only proceed if we have something to update
    if (Object.keys(updateData).length === 0) {
      return await findById(sql, id);
    }

    const columns = Object.keys(updateData).map((key) =>
      sql.unsafe(`${key.replace(/([A-Z])/g, '_$1').toLowerCase()} = ?`, [
        updateData[key] as string | number | null,
      ])
    );

    const [updatedRecipe] = await sql`
    UPDATE recipes 
    SET ${sql.unsafe(columns.join(', '))}
    WHERE id = ${id}
    RETURNING *
  `;

    return updatedRecipe as RecipeEntity;
  }
);

export const deleteRecipe = optionalTransaction(async (sql: Sql, id: number): Promise<boolean> => {
  const result = await sql`
    DELETE FROM recipes WHERE id = ${id}
  `;
  return result.count > 0;
});

export const findByUsername = optionalTransaction(
  (
    sql: Sql,
    username: string,
    cursor: number | null = null,
    limit = 10
  ): Promise<RawRecipeEntity[]> => {
    return sql<RawRecipeEntity[]>`
      SELECT * FROM recipes ${cursor ? sql`WHERE created_at < ${cursor}` : sql``}
      AND username = ${username} 
      ORDER BY created_at DESC 
      LIMIT ${limit as number}
    `;
  }
);

export const search = optionalTransaction(
  (
    sql: Sql,
    searchTerm: string,
    cursor: number | null = null,
    limit = 10
  ): Promise<RawRecipeEntity[]> => {
    const searchPattern = `%${searchTerm}%`;
    return sql<RawRecipeEntity[]>`
      SELECT * FROM recipes 
      WHERE title ILIKE ${searchPattern} OR description ILIKE ${searchPattern} 
      ${cursor ? sql`AND created_at < ${cursor}` : sql``}
      ORDER BY created_at DESC 
      LIMIT ${limit as number}
    `;
  }
);

export const findWithFavoriteStatus = optionalTransaction(
  (
    sql: Sql,
    userId: number,
    cursor: number | null = null,
    limit = 10
  ): Promise<Array<RawRecipeEntity>> => {
    return sql<RawRecipeEntity[]>`
      SELECT r.*, 
        CASE WHEN rf.recipe_id IS NOT NULL THEN TRUE ELSE FALSE END AS is_favorite
      FROM recipes r
      LEFT JOIN recipe_favorites rf ON r.id = rf.recipe_id AND rf.user_id = ${userId}
      ${cursor ? sql`{WHERE r.created_at < ${cursor}` : sql``}
      ORDER BY r.created_at DESC
      LIMIT ${limit as number}
    `;
  }
);

export const findFavorites = optionalTransaction(
  async (
    sql: Sql,
    userId: number,
    cursor: number | null = null,
    limit = 10
  ): Promise<Array<RecipeEntity>> => {
    return sql<Array<RecipeEntity>>`
      SELECT r.*, TRUE AS is_favorite
      FROM recipes r
      JOIN recipe_favorites rf ON r.id = rf.recipe_id AND rf.user_id = ${userId}
      WHERE r.created_at < ${cursor}
      ORDER BY r.created_at DESC
      LIMIT ${limit as number}
    `;
  }
);
