
## Deploy to Kubernetes

Make sure your terminal is connected to your Kubernetes cluster (via `kubectl`), and put all four of those YAML files in a single folder (e.g., `k8s-manifests`).

Run this command to apply them in order:

Get Repo
```sh
git clone --depth=1 https://github.com/aamitn/bitmutex-website.git
cd  bitmutex-website/k8s
```

Apply Infra
```sh
kubectl apply -f 01-secrets.yaml
kubectl apply -f 02-volumes.yaml
kubectl apply -f 03-postgres.yaml
kubectl apply -f 04-app.yaml
```

To see when your app is officially online and grab your public IP address, run:
```sh
kubectl get services
```


## Deploy via Helm


**1. Install**
```sh
cd  bitmutex-website/k8s
helm  install  my-bitmutex-release  ./bm-helm-chart
```

**2. Update it on the fly (The Magic of Helm):** Let's say you want to push version `1.1.0` of your image and you want to use a more secure database password. You don't have to edit the YAML files. Just pass the new values directly into the upgrade command!

```sh
helm upgrade my-bitmutex-release ./bitmutex-chart \
  --set app.image.tag="1.1.0" \
  --set postgres.password="SuperSecret123!"
```
**3. UnInstall**
```sh
helm uninstall my-bitmutex-release
```

