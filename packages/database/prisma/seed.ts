import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
      console.log('Start seeding...')

      // Create default categories
      const categories = [
            { name: 'Electronics', description: 'Electronic devices and gadgets' },
            { name: 'Clothing', description: 'Fashion and apparel' },
            { name: 'Home & Garden', description: 'Home improvement and garden supplies' },
            { name: 'Books', description: 'Books and literature' },
            { name: 'Sports', description: 'Sports equipment and accessories' },
            { name: 'Toys', description: 'Toys and games' },
            { name: 'Food & Beverages', description: 'Food and drink products' },
            { name: 'Health & Beauty', description: 'Health and beauty products' },
      ]

      for (const category of categories) {
            const existingCategory = await prisma.category.findFirst({
                  where: { name: category.name }
            })

            if (!existingCategory) {
                  await prisma.category.create({
                        data: category
                  })
                  console.log(`Created category: ${category.name}`)
            } else {
                  console.log(`Category already exists: ${category.name}`)
            }
      }

      console.log('Seeding finished.')
}

main()
      .catch((e) => {
            console.error(e)
            process.exit(1)
      })
      .finally(async () => {
            await prisma.$disconnect()
      })
