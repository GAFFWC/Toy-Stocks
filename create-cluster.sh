source config.sh

gcloud config set project ${PROJECT_ID}

gcloud deployment-manager deployments create ts-study-cluster --config cluster.yaml