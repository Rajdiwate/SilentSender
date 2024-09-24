import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  schema: 'src/lib/schema.ts',
  dialect: 'postgresql',
  dbCredentials :{
    url : "postgres://postgres:Rd@897554@localhost:5432/trueFeedback"
  },
  verbose : true,
  strict : true
})

