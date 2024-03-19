#!/bin/bash

# Function to show usage instructions
function show_usage {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  --env [development|production]   Set the environment type."
    echo "  --sync                           Sync database schema (development only)."
    echo "  --create-migration               Create a new migration (development)."
    echo "  --name [migration_name]          Specify migration name (with --create-migration)."
    echo "  --reset                          Reset the database (development)."
    echo "  --deploy                         Deploy migrations (production)."
    echo "  --create-no-deploy               Create a new migration without deploying (production)."
    echo "  --toggle-locking                 Toggle advisory locking (production)."
    echo "  --help                           Display this help message."
    echo "If no options are provided, an interactive menu will guide you through the available actions."
}

# Default values
ENV=""
ACTION=""
MIGRATION_NAME=""

# Functions for actions

function sync_schema {
    npx prisma db push
    echo "Database schema synced."
}

function create_migration {
    if [[ -n "$MIGRATION_NAME" ]]; then
        npx prisma migrate dev --name "$MIGRATION_NAME"
    else
        npx prisma migrate dev
    fi
    echo "Migration created and applied."
}

function reset_database {
    npx prisma migrate reset
    echo "Database reset."
}

function deploy_migrations {
    npx prisma migrate deploy
    echo "Migrations deployed."
}

function create_migration_no_deploy {
    npx prisma migrate dev --create-only
    echo "Migration created without deploying."
}

function toggle_advisory_locking {
    if [[ "$PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK" == "true" ]]; then
        export PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK=false
        echo "Advisory locking enabled."
    else
        export PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK=true
        echo "Advisory locking disabled."
    fi
}

# Interactive menu for environment selection
function select_environment {
    echo "Select environment type:"
    select env in "development" "production"; do
        case $env in
            development )
                ENV="development"
                break
                ;;
            production )
                ENV="production"
                break
                ;;
            *) echo "Invalid option $REPLY";;
        esac
    done
}

# Interactive menu for action selection based on environment
function select_action {
    if [[ $ENV == "development" ]]; then
        echo "Select action:"
        select act in "Sync database schema" "Create a new migration" "Reset the database" "Quit"; do
            case $act in
                "Sync database schema") ACTION="sync_schema"; break ;;
                "Create a new migration") 
                    ACTION="create_migration"
                    read -p "Do you want to specify a name for the new migration? This will create a new migration file in the migrations directory (y/n): " yn
                    case $yn in
                        [Yy]* ) 
                            read -p "Enter migration name: " MIGRATION_NAME ;;
                        [Nn]* ) ;;
                        * ) echo "Please answer yes or no.";;
                    esac
                    break ;;
                "Reset the database") ACTION="reset_database"; break ;;
                "Quit") exit 0 ;;
                *) echo "Invalid option $REPLY";;
            esac
        done
    elif [[ $ENV == "production" ]]; then
        echo "Select action:"
        select act in "Deploy migrations" "Create a new migration without deploying" "Toggle advisory locking" "Quit"; do
            case $act in
                "Deploy migrations") ACTION="deploy_migrations"; break ;;
                "Create a new migration without deploying") ACTION="create_migration_no_deploy"; break ;;
                "Toggle advisory locking") ACTION="toggle_advisory_locking"; break ;;
                "Quit") exit 0 ;;
                *) echo "Invalid option $REPLY";;
            esac
        done
    fi
}

# Parse arguments
if [[ $# -gt 0 ]]; then
    while [[ $# -gt 0 ]]; do
        case $1 in
            --env)
                ENV=$2
                shift # past argument
                shift # past value
                ;;
            --sync)
                ACTION="sync_schema"
                shift # past argument
                ;;
            --create-migration)
                ACTION="create_migration"
                shift # past argument
                ;;
            --name)
                MIGRATION_NAME=$2
                shift # past argument
                shift # past value
                ;;
            --reset)
                ACTION="reset_database"
                shift # past argument
                ;;
            --deploy)
                ACTION="deploy_migrations"
                shift # past argument
                ;;
            --create-no-deploy)
                ACTION="create_migration_no_deploy"
                shift # past argument
                ;;
            --toggle-locking)
                ACTION="toggle_advisory_locking"
                shift # past argument
                ;;
            --help)
                show_usage
                exit 0
                ;;
            *)
                echo "Unknown or unsupported option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
else
    select_environment
    select_action
fi

# Execute action
case $ACTION in
    sync_schema) sync_schema ;;
    create_migration) create_migration ;;
    reset_database) reset_database ;;
    deploy_migrations) deploy_migrations ;;
    create_migration_no_deploy) create_migration_no_deploy ;;
    toggle_advisory_locking) toggle_advisory_locking ;;
    *) echo "No valid action selected. Exiting."; exit 1 ;;
esac
