source config.sh

gcloud builds submit --config cloudbuild.yaml --project ${PROJECT_ID} \
--substitutions=_CLOUDRUNSTAMP=${CLOUDRUNSTAMP},_APP_NAME=${APP_NAME},_ZONE=${ZONE},_CLUSTER_NAME=${CLUSTER_NAME},_NAMESPACE=${NAMESPACE}