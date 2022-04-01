# This is the README for the Digital Twin master thesis

## Kubernetes
For the kubernetes setup i chose minikube which only can setup one node. but that should be sufficient for my usecase. I use docker to deploy minikube.

Startup:
- sudo dockerd
- sudo usermod -aG docker $USER && newgrp docker
- `minikube start --insecure-registry "10.0.0.0/24"` #https://minikube.sigs.k8s.io/docs/handbook/registry/#enabling-insecure-registries/
- set alias in bashrc (alias kubectl="minikube kubectl --")

### Deployments
- stateless deployments for nginx and digital twin.
- statefull deployment for graphdb and influxdb

## InfluxDB
-username: pascal
password: pascal123
apiToken: IZIqFfPorqpb_W0KiraX041HbcytdL7HEN1DZnVbLQBLoMQ0wLcM4fEys2IU-fdBb7wmfGNydJKJoHOQFbcu8g==

- change assets path! `https://docs.influxdata.com/influxdb/v2.1/reference/config-options/#assets-path`

### Ingress
To make the ingress available from the windows browser:
- load nginx ingress `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.2/deploy/static/provider/cloud/deploy.yaml`
- map local port to port in wsl2 within vscode ports
- portforwarding from kubectl port-forward to your external ip
- minikube tunnel to tunnel your load balancer to the external ip
- set local dns entries on the host machine. for Windows: C:\Windows\System32\drivers\etc
```
# setting host for wsl2
127.0.0.1  graphdb.org
127.0.0.1  influxdb.org
```

- getting nginx conf
```
$ kubectl get pods -n kube-system | grep ingress-nginx-controller
ingress-nginx-controller-69ccf5d9d8-vkg5f   1/1       Running
$ kubectl exec -it -n kube-system ingress-nginx-controller-69ccf5d9d8-vkg5f cat /etc/nginx/nginx.conf
# Configuration checksum: 1983714050352580293
```

- otherwise look up graphdb vhost for proxy configuration.

## Docker Registry
- enable addon `minikube addons enable registry`
- docker tag graphdb $(minikube ip):5000/graphdb
- /etc/docker daemon.json set insecure repo. restart docker engine
- start minikube with insecure registry https://minikube.sigs.k8s.io/docs/handbook/registry/#enabling-insecure-registries/
`minikube start --insecure-registry "10.0.0.0/24"`
- push image: ` docker push $(minikube ip):5000/graphdb`


## Security notes: 
- make internal docker repo secure

