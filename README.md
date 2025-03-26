# Bitmutex Strapi + Next.js

\
**Strapi 5 + Next.js 15** - A modern, containerized full-stack application for Bitmutex Technologies.

---

## 🚀 Features

- **Strapi 5 CMS** (Headless API-driven backend)
- **Next.js 15** (Fast, SSR-capable frontend)
- **PostgreSQL 15** (Database for Strapi)
- **Docker-Compose Support** (For seamless development & deployment)
- **Strapi Auto-Admin User Creation** (Creates admin user on first run)
- **Health Check & Auto-Restart** (Ensures services stay healthy)
- **Sitewide Dynamic SEO** (with Strapi SEO Plugin Integration) 

---

## 📂 Project Structure

```
📦 bitmutex-strapi-next-app
├── 📂 client       # Next.js frontend
├── 📂 server       # Strapi backend (CMS)
├── 📜 docker-compose.yml  # Container configuration
├── 📜 seed-data.tar.gz    # Database seed (must be imported manually)
└── 📜 README.md     # This file
```

---

## ⚙️ Setup Instructions

### 1️⃣ **Clone the Repository**

```sh
git clone https://github.com/bitmutex/bitmutex-strapi-next.git
cd bitmutex-strapi-next
```

### 2️⃣ **Environment Variables**

Update the **`.env`** files inside `client/` and `server/` directories.

### 3️⃣ **Run with Docker**

```sh
docker-compose up --build
```

This will start:

- PostgreSQL at `localhost:5432`
- Strapi CMS at `http://localhost:1337`
- Next.js Frontend at `http://localhost:3000`

### 4️⃣ **Manual Data Import (Strapi Limitation)**

⚠️ **Strapi does NOT support data import in Docker builds** ([GitHub Issue](https://github.com/strapi/strapi/issues/15868))

**To manually import seed data:**

```sh
docker exec -it bitmutex-strapi bash
# Inside the container
yarn strapi import -f /seed-data.tar.gz --force
```

---

## 🔑 Default Admin Credentials

> These credentials are created automatically when `AUTO_CREATE_ADMIN=true` in `docker-compose.yml`

- **Email**: `admin@bitmutex.com`
- **Password**: `strapiadmin`

🚨 **Change the default password after the first login!**

---

## 📜 Useful Commands

### Run Strapi & Next.js Locally

```sh
yarn dev
```

### Build & Start Next.js

```sh
yarn build && yarn start
```

### Stop All Containers

```sh
docker-compose down
```

### Restart Containers

```sh
docker-compose up --force-recreate --build
```

---

## 📌 Notes

- The Strapi admin user is automatically created only if no admin exists.
- Data import must be done manually due to Strapi’s Docker limitations.
- The project is set up for local development. For production, additional configurations like SSL, domain names, and reverse proxy (NGINX) are needed.

---

## 📞 Support

If you encounter issues, feel free to open an issue or contact [Bitmutex Technologies](https://bitmutex.com/contact).

