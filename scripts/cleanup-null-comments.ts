// scripts/cleanup-null-comments.ts
// Run this after your app starts successfully to clean up comments with null authors

import { getPayload } from 'payload'
import config from '../src/payload.config'

async function cleanupComments() {
  console.log('🚀 Starting comment cleanup...')

  const payload = await getPayload({ config })

  try {
    // Find all comments without authors
    const commentsWithoutAuthor = await payload.find({
      collection: 'comments',
      where: {
        author: {
          exists: false,
        },
      },
      limit: 1000,
    })

    console.log(`📊 Found ${commentsWithoutAuthor.totalDocs} comments without authors`)

    if (commentsWithoutAuthor.totalDocs === 0) {
      console.log('✅ No comments to clean up!')
      return
    }

    // Delete each comment
    let deleted = 0
    for (const comment of commentsWithoutAuthor.docs) {
      try {
        await payload.delete({
          collection: 'comments',
          id: comment.id,
        })
        deleted++
        console.log(`  ✓ Deleted comment ${comment.id}`)
      } catch (error) {
        console.error(`  ✗ Failed to delete comment ${comment.id}:`, error.message)
      }
    }

    console.log(`\n✅ Successfully deleted ${deleted} comments`)
    console.log('\n🎉 Cleanup complete! You can now set author field back to required: true')
    console.log('   Update src/collections/Comments.ts line 60 back to: required: true')

  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    throw error
  }
}

cleanupComments()
  .then(() => {
    console.log('\n✨ Script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error)
    process.exit(1)
  })
