# Stage 1: Build stage
FROM node:22-alpine AS builder

# Cài đặt các công cụ build cần thiết 
RUN apk add --no-cache python3 make g++

WORKDIR /SmartDebt_BackEnd

# Copy file cấu hình để tận dụng Docker layer caching
COPY package*.json ./

# Cài đặt tất cả dependencies (bao gồm cả devDependencies để build code)
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Nếu dự án dùng TypeScript hoặc cần build (ví dụ: NestJS), hãy uncomment dòng dưới
# RUN npm run build

# Stage 2: Production stage
FROM node:22-alpine
WORKDIR /SmartDebt_BackEnd

# Chỉ copy những file thực sự cần thiết từ stage builder
COPY --from=builder /SmartDebt_BackEnd/package*.json ./
COPY --from=builder /SmartDebt_BackEnd/node_modules ./node_modules
COPY --from=builder /SmartDebt_BackEnd . 

# Thiết lập biến môi trường
ENV NODE_ENV=production
ENV PORT=3000

# Azure Web App lắng nghe port 3000 cho container
EXPOSE 3000

CMD ["node", "src/index.js"]