import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const customers = [
    { name: "Aryan Kapoor", email: "aryan.kapoor@gmail.com", phone: "+91-9876541001" },
    { name: "Ishaan Malhotra", email: "ishaan.malhotra@gmail.com", phone: "+91-9876541002" },
    { name: "Zara Khan", email: "zara.khan@gmail.com", phone: "+91-9876541003" },
    { name: "Vivaan Sharma", email: "vivaan.sharma@gmail.com", phone: "+91-9876541004" },
    { name: "Aisha Patel", email: "aisha.patel@gmail.com", phone: "+91-9876541005" },
    { name: "Rehan Siddiqui", email: "rehan.siddiqui@gmail.com", phone: "+91-9876541006" },
    { name: "Ananya Reddy", email: "ananya.reddy@gmail.com", phone: "+91-9876541007" },
    { name: "Kabir Mehta", email: "kabir.mehta@gmail.com", phone: "+91-9876541008" },
    { name: "Tara Nair", email: "tara.nair@gmail.com", phone: "+91-9876541009" },
    { name: "Rohan Gupta", email: "rohan.gupta@gmail.com", phone: "+91-9876541010" },
    { name: "Prisha Iyer", email: "prisha.iyer@gmail.com", phone: "+91-9876541011" },
    { name: "Aadit Joshi", email: "aadit.joshi@gmail.com", phone: "+91-9876541012" },
    { name: "Myra Singh", email: "myra.singh@gmail.com", phone: "+91-9876541013" },
    { name: "Vihaan Chopra", email: "vihaan.chopra@gmail.com", phone: "+91-9876541014" },
    { name: "Saanvi Verma", email: "saanvi.verma@gmail.com", phone: "+91-9876541015" },
    { name: "Advait Kumar", email: "advait.kumar@gmail.com", phone: "+91-9876541016" },
    { name: "Kiara Bhat", email: "kiara.bhat@gmail.com", phone: "+91-9876541017" },
    { name: "Shaurya Pillai", email: "shaurya.pillai@gmail.com", phone: "+91-9876541018" },
    { name: "Navya Menon", email: "navya.menon@gmail.com", phone: "+91-9876541019" },
    { name: "Dhruv Agarwal", email: "dhruv.agarwal@gmail.com", phone: "+91-9876541020" },
    { name: "Anika Saxena", email: "anika.saxena@gmail.com", phone: "+91-9876541021" },
    { name: "Pranav Rao", email: "pranav.rao@gmail.com", phone: "+91-9876541022" },
    { name: "Siya Tiwari", email: "siya.tiwari@gmail.com", phone: "+91-9876541023" },
    { name: "Atharv Malhotra", email: "atharv.malhotra@gmail.com", phone: "+91-9876541024" },
    { name: "Diya Sharma", email: "diya.sharma@gmail.com", phone: "+91-9876541025" },
    { name: "Rudra Patel", email: "rudra.patel@gmail.com", phone: "+91-9876541026" },
    { name: "Avni Reddy", email: "avni.reddy@gmail.com", phone: "+91-9876541027" },
    { name: "Arnav Nair", email: "arnav.nair@gmail.com", phone: "+91-9876541028" },
    { name: "Pari Gupta", email: "pari.gupta@gmail.com", phone: "+91-9876541029" },
    { name: "Krish Iyer", email: "krish.iyer@gmail.com", phone: "+91-9876541030" },
    { name: "Riya Joshi", email: "riya.joshi@gmail.com", phone: "+91-9876541031" },
    { name: "Ayaan Singh", email: "ayaan.singh@gmail.com", phone: "+91-9876541032" },
    { name: "Ira Chopra", email: "ira.chopra@gmail.com", phone: "+91-9876541033" },
    { name: "Shivansh Verma", email: "shivansh.verma@gmail.com", phone: "+91-9876541034" },
    { name: "Aara Kumar", email: "aara.kumar@gmail.com", phone: "+91-9876541035" },
    { name: "Yuvan Bhat", email: "yuvan.bhat@gmail.com", phone: "+91-9876541036" },
    { name: "Mira Pillai", email: "mira.pillai@gmail.com", phone: "+91-9876541037" },
    { name: "Darsh Menon", email: "darsh.menon@gmail.com", phone: "+91-9876541038" },
    { name: "Shanaya Agarwal", email: "shanaya.agarwal@gmail.com", phone: "+91-9876541039" },
    { name: "Reyansh Saxena", email: "reyansh.saxena@gmail.com", phone: "+91-9876541040" },
    { name: "Amaira Rao", email: "amaira.rao@gmail.com", phone: "+91-9876541041" },
    { name: "Laksh Tiwari", email: "laksh.tiwari@gmail.com", phone: "+91-9876541042" },
    { name: "Kyra Malhotra", email: "kyra.malhotra@gmail.com", phone: "+91-9876541043" },
    { name: "Vivek Sharma", email: "vivek.sharma@gmail.com", phone: "+91-9876541044" },
    { name: "Neha Patel", email: "neha.patel@gmail.com", phone: "+91-9876541045" },
    { name: "Rahul Reddy", email: "rahul.reddy@gmail.com", phone: "+91-9876541046" },
    { name: "Pooja Nair", email: "pooja.nair2@gmail.com", phone: "+91-9876541047" },
    { name: "Sumit Gupta", email: "sumit.gupta@gmail.com", phone: "+91-9876541048" },
    { name: "Ritika Iyer", email: "ritika.iyer@gmail.com", phone: "+91-9876541049" },
    { name: "Manish Joshi", email: "manish.joshi@gmail.com", phone: "+91-9876541050" },
  ]

  for (const customer of customers) {
    const created = await prisma.customer.upsert({
      where: { email: customer.email },
      update: {},
      create: customer,
    })

    const orderCount = Math.floor(Math.random() * 6) + 1
    for (let i = 0; i < orderCount; i++) {
      const daysAgo = Math.floor(Math.random() * 150)
      await prisma.order.create({
        data: {
          customerId: created.id,
          amount: Math.floor(Math.random() * 12000) + 500,
          createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        },
      })
    }
  }

  console.log("✅ 50 more customers added!")
}

main().catch(console.error).finally(() => prisma.$disconnect())
