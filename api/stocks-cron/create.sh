source config.sh

gcloud container clusters get-credentials ${CLUSTER_NAME} --zone ${ZONE} --project ${PROJECT_ID}

kubectl create -f k8s.yaml

bash ./deploy.sh