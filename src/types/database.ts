/**
 * Placeholder for the Supabase generated types.
 *
 * Once the project is linked, regenerate the real types with:
 *   npx supabase gen types typescript --project-id <ref> --schema public > src/types/database.ts
 *
 * `any` is used deliberately here (not a lazy fallback): typing this as a
 * strict-but-empty `Tables: {}` shape fights the supabase-js generic
 * helpers (TablesInsert<>, etc.) and produces `never` on every .insert()/
 * .rpc() call, which is worse than no typing at all. The domain-specific
 * interfaces in `src/types/index.ts` are what application code actually
 * imports and reads for shape safety; this only needs to satisfy the
 * SupabaseClient<Database> generic until real types are generated.
 */
export type Database = any;
