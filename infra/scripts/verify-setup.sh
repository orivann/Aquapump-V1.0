#!/bin/bash

# ===============================================
# AquaPump Setup Verification Script
# ===============================================
# This script verifies your AquaPump setup
# Run: bash infra/scripts/verify-setup.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  AquaPump Setup Verification${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Function to check command exists
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $1 is NOT installed"
        ((FAILED++))
        return 1
    fi
}

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2 exists"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $2 does NOT exist"
        ((FAILED++))
        return 1
    fi
}

# Function to check directory exists
check_directory() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $2 exists"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $2 does NOT exist"
        ((FAILED++))
        return 1
    fi
}

# Function to warn
warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

# Section 1: Required Tools
echo -e "\n${BLUE}1. Checking Required Tools${NC}"
echo "----------------------------"
check_command "node"
check_command "bun"
check_command "docker"
check_command "git"

# Section 2: Optional Tools
echo -e "\n${BLUE}2. Checking Optional Tools${NC}"
echo "----------------------------"
if ! check_command "kubectl"; then
    warn "kubectl not found - needed for Kubernetes deployment"
fi

if ! check_command "helm"; then
    warn "helm not found - needed for Helm deployment"
fi

# Section 3: Project Structure
echo -e "\n${BLUE}3. Checking Project Structure${NC}"
echo "--------------------------------"
check_directory "frontend" "Frontend directory"
check_directory "backend" "Backend directory"
check_directory "infra" "Infrastructure directory"
check_directory "frontend/app" "Frontend app directory"
check_directory "frontend/components" "Frontend components directory"
check_directory "backend/trpc" "Backend tRPC directory"

# Section 4: Configuration Files
echo -e "\n${BLUE}4. Checking Configuration Files${NC}"
echo "----------------------------------"
check_file "package.json" "package.json"
check_file "tsconfig.json" "tsconfig.json"
check_file ".gitignore" ".gitignore"
check_file "infra/docker-compose.yml" "Docker Compose file"

# Section 5: Environment Configuration
echo -e "\n${BLUE}5. Checking Environment Configuration${NC}"
echo "----------------------------------------"
check_file ".env.example" ".env.example template"

if check_file ".env" ".env file"; then
    # Check for required variables
    if grep -q "EXPO_PUBLIC_SUPABASE_URL" .env; then
        if grep -q "your-project.supabase.co" .env; then
            warn ".env contains placeholder values - please update with real credentials"
        else
            echo -e "${GREEN}✓${NC} EXPO_PUBLIC_SUPABASE_URL is configured"
            ((PASSED++))
        fi
    else
        echo -e "${RED}✗${NC} EXPO_PUBLIC_SUPABASE_URL is missing in .env"
        ((FAILED++))
    fi
    
    if grep -q "EXPO_PUBLIC_SUPABASE_ANON_KEY" .env; then
        if grep -q "your-supabase-anon-key" .env; then
            warn ".env ANON_KEY contains placeholder - please update"
        else
            echo -e "${GREEN}✓${NC} EXPO_PUBLIC_SUPABASE_ANON_KEY is configured"
            ((PASSED++))
        fi
    else
        echo -e "${RED}✗${NC} EXPO_PUBLIC_SUPABASE_ANON_KEY is missing in .env"
        ((FAILED++))
    fi
else
    warn "No .env file found. Run: cp .env.example .env"
fi

# Section 6: Docker Configuration
echo -e "\n${BLUE}6. Checking Docker Configuration${NC}"
echo "-----------------------------------"
check_file "infra/Dockerfile" "Main Dockerfile"
check_file "infra/Dockerfile.backend" "Backend Dockerfile"
check_file "infra/Dockerfile.frontend" "Frontend Dockerfile"

# Section 7: Kubernetes/Helm
echo -e "\n${BLUE}7. Checking Kubernetes/Helm Configuration${NC}"
echo "--------------------------------------------"
check_directory "infra/helm/aquapump" "Helm chart directory"
check_file "infra/helm/aquapump/Chart.yaml" "Helm Chart.yaml"
check_file "infra/helm/aquapump/values.yaml" "Helm values.yaml"

# Section 8: Dependencies
echo -e "\n${BLUE}8. Checking Dependencies${NC}"
echo "--------------------------"
if check_directory "node_modules" "node_modules directory"; then
    echo -e "${GREEN}✓${NC} Dependencies installed"
else
    warn "Dependencies not installed. Run: bun install"
fi

# Section 9: Documentation
echo -e "\n${BLUE}9. Checking Documentation${NC}"
echo "----------------------------"
check_file "README.md" "README.md"
check_file "PRODUCTION_GUIDE.md" "Production Guide"
check_file "QUICK_START.md" "Quick Start Guide"
check_file "OPTIMIZATION_SUMMARY.md" "Optimization Summary"

# Section 10: Security
echo -e "\n${BLUE}10. Checking Security Configuration${NC}"
echo "--------------------------------------"

# Check .gitignore for secrets
if grep -q ".env" .gitignore; then
    echo -e "${GREEN}✓${NC} .env files are in .gitignore"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} .env files NOT in .gitignore - SECURITY RISK!"
    ((FAILED++))
fi

if grep -q "secrets.yaml" .gitignore; then
    echo -e "${GREEN}✓${NC} secrets.yaml is in .gitignore"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} secrets.yaml NOT in .gitignore - SECURITY RISK!"
    ((FAILED++))
fi

# Check for committed secrets
if git ls-files | grep -q "\.env$"; then
    echo -e "${RED}✗${NC} WARNING: .env file is committed to git!"
    ((FAILED++))
else
    echo -e "${GREEN}✓${NC} No .env files committed to git"
    ((PASSED++))
fi

# Final Summary
echo -e "\n${BLUE}======================================${NC}"
echo -e "${BLUE}  Verification Summary${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""
echo -e "${GREEN}Passed: ${PASSED}${NC}"
echo -e "${RED}Failed: ${FAILED}${NC}"
echo -e "${YELLOW}Warnings: ${WARNINGS}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All critical checks passed!${NC}"
    echo ""
    echo -e "${BLUE}Next Steps:${NC}"
    echo "  1. Update .env with your credentials"
    echo "  2. Start backend: bun run backend/server.ts"
    echo "  3. Start frontend: bun start"
    echo "  4. Access: http://localhost:19006"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some checks failed. Please fix the issues above.${NC}"
    echo ""
    exit 1
fi
