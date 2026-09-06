# HRIS (Human Resource Information System)

Wb-based Human Resource Information System (HRIS) designed to manage employee attendance, department data, and visualize corporate disciplinary trends in real-time.

## Tech Stack

This application is built with a modern, enterprise-grade technology stack:

* **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack)
* **Language:** TypeScript
* **ORM / Database:** [Prisma](https://www.prisma.io/) (PostgreSQL / MySQL)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **UI Components:** [Shadcn UI](https://ui.shadcn.com/) (Radix Primitives)
* **Data Visualization:** [Recharts](https://recharts.org/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Date Formatting:** `date-fns`
* **Package Manager:** [Bun](https://bun.sh/)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18+ recommended)
* [Bun](https://bun.sh/) (Package Manager)
* A running Database Server (MySQL / PostgreSQL, either local or cloud-hosted)

## Installation & Setup (Local Development)

Follow these steps to set up and run the project locally:

**1. Clone the Repository**
\`\`\`bash
git clone https://github.com/naufal-dzaki/hris_ujikom.git
cd hris_ujikom
\`\`\`

**2. Install Dependencies**
\`\`\`bash
bun install
\`\`\`

**3. Configure Environment Variables**
Create a `.env` file in the root directory and configure your database connection string:
\`\`\`env
DATABASE_URL="mysql://root:password@localhost:3306/hris_db"
# Adjust the credentials to match your local database setup
\`\`\`

**4. Database Migration**
Run the following command to create the necessary tables in your database based on the Prisma schema:
\`\`\`bash
bunx prisma migrate dev --name init
\`\`\`

**5. Seed the Database**
To populate the database with the initial Superadmin account and sample data, run:
\`\`\`bash
bunx prisma db seed
\`\`\`

**6. Start the Development Server**
\`\`\`bash
bun run dev
\`\`\`
The application will be available at \`http://localhost:3000\`.

## Production Build

To run the application with maximum performance and eliminate compilation delays during your presentation:

\`\`\`bash
# 1. Build the application
bun run build

# 2. Start the production server
bun run start
\`\`\`