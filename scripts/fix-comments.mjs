// scripts/fix-comments.mjs - Fix null author_id in comments
import { config } from 'dotenv'
import { Pool } from 'pg'

config()

const connectionString = process.env.DATABASE_URI

if (!connectionString) {
  console.error('❌ DATABASE_URI environment variable not set')
  process.exit(1)
}

const pool = new Pool({ connectionString })

async function fixComments() {
  const client = await pool.connect()

  try {
    console.log('🔍 Checking for comments with null author_id...')

    // Check how many comments have null author_id
    const countResult = await client.query(
      'SELECT COUNT(*) FROM comments WHERE author_id IS NULL'
    )

    const nullCount = parseInt(countResult.rows[0].count)
    console.log(`Found ${nullCount} comments with null author_id`)

    if (nullCount === 0) {
      console.log('✅ No comments with null author_id found. Database is clean!')
      return
    }

    // Option 1: Delete comments with null author_id
    console.log(`\n🗑️  Deleting ${nullCount} comments with null author_id...`)

    const deleteResult = await client.query(
      'DELETE FROM comments WHERE author_id IS NULL'
    )

    console.log(`✅ Deleted ${deleteResult.rowCount} comments successfully`)

    // Verify
    const verifyResult = await client.query(
      'SELECT COUNT(*) FROM comments WHERE author_id IS NULL'
    )
    const remainingNull = parseInt(verifyResult.rows[0].count)

    if (remainingNull === 0) {
      console.log('✅ All comments with null author_id have been removed')
      console.log('\n🎉 Database is now ready! You can restart the application.')
    } else {
      console.log(`⚠️  Warning: ${remainingNull} comments with null author_id still remain`)
    }

  } catch (error) {
    console.error('❌ Error fixing comments:', error.message)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

fixComments()
  .then(() => {
    console.log('\n✨ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error)
    process.exit(1)
  })
