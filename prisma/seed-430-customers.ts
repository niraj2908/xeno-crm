import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const firstNames = [
  "Abhinav","Akash","Alok","Anirudh","Anmol","Ansh","Arpit","Ayush","Bhavesh","Chirag",
  "Dev","Devansh","Gaurav","Harsh","Hemant","Jatin","Jay","Kunal","Lokesh","Mohit",
  "Naman","Nitin","Om","Parth","Prateek","Raghav","Rajat","Sarthak","Shubham","Tanmay",
  "Uday","Varun","Yash","Yuvraj","Zubin","Aditi","Akriti","Anushka","Bhavna","Charu",
  "Esha","Garima","Harini","Ishita","Jiya","Khushi","Lavanya","Mahima","Nandini","Palak",
  "Rashi","Rhea","Sakshi","Tanvi","Urvashi","Vanya","Yamini","Zoya"
]

const lastNames = [
  "Arora","Bansal","Chaudhary","Deshmukh","Dubey","Ghosh","Jain","Kulkarni","Mishra",
  "Pandey","Roy","Sethi","Srivastava","Thakur","Yadav","Dutta","Kaul","Mukherjee",
  "Naidu","Ojha","Prasad","Rawat","Soni","Tripathi","Upadhyay","Vyas","Wadhwa","Bakshi"
]

function randomItem(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

async function main() {
  console.log("Creating customers...")

  for (let i = 1; i <= 430; i++) {
    const firstName = randomItem(firstNames)
    const lastName = randomItem(lastNames)

    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${1000 + i}@gmail.com`

    const existing = await prisma.customer.findUnique({
      where: { email }
    })

    if (existing) continue

    const customer = await prisma.customer.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        phone: `+91${8000000000 + i}`
      }
    })

    const orderCount = Math.floor(Math.random() * 6) + 2

    for (let j = 0; j < orderCount; j++) {
      await prisma.order.create({
        data: {
          customerId: customer.id,
          amount: Math.floor(Math.random() * 12000) + 500
        }
      })
    }

    if (i % 50 === 0) {
      console.log(`Added ${i} customers`)
    }
  }

  console.log("Done!")
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
