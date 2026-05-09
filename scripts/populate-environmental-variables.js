#!/usr/bin/env node
/**
 * Populates environmental_variables in mcp-servers.json from operator-plus MCP server implementations.
 * Run from mcp-servers directory: node scripts/populate-environmental-variables.js
 */

const fs = require('fs');
const path = require('path');

const MCP_SERVERS_DIR = path.resolve(__dirname, '..');
const JSON_PATH = path.join(MCP_SERVERS_DIR, 'mcp-servers.json');

// Map: path (vendor/product dir) -> array of env var names (from operator-plus repo)
const PATH_ENV_MAP = {
  // AWS
  'aws/ec2': ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_SESSION_TOKEN', 'AWS_REGION'],
  'aws/vpc': ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_SESSION_TOKEN', 'AWS_REGION'],
  'aws/s3': ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_SESSION_TOKEN', 'AWS_REGION'],
  'aws/iam': ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_SESSION_TOKEN', 'AWS_REGION'],
  'aws/elb': ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_SESSION_TOKEN', 'AWS_REGION'],
  'aws/rds': ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_SESSION_TOKEN', 'AWS_REGION'],
  'aws/lambda': ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_SESSION_TOKEN', 'AWS_REGION'],
  'aws/eks': ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_SESSION_TOKEN', 'AWS_REGION'],
  'aws/cloudwatch': ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_SESSION_TOKEN', 'AWS_REGION'],
  'aws/route53': ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_SESSION_TOKEN', 'AWS_REGION'],
  'aws/dynamodb': ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_SESSION_TOKEN', 'AWS_REGION'],
  'aws/cloudfront': ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_SESSION_TOKEN', 'AWS_REGION'],
  'aws/sqs': ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_SESSION_TOKEN', 'AWS_REGION'],
  'aws/sns': ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_SESSION_TOKEN', 'AWS_REGION'],
  'aws/ecr': ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_SESSION_TOKEN', 'AWS_REGION'],
  'aws/ecs': ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_SESSION_TOKEN', 'AWS_REGION'],
  'aws/cloudformation': ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_SESSION_TOKEN', 'AWS_REGION'],
  'aws/secretsmanager': ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_SESSION_TOKEN', 'AWS_REGION'],
  'aws/kms': ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_SESSION_TOKEN', 'AWS_REGION'],
  // Azure
  'azure/vm': ['AZURE_SUBSCRIPTION_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'],
  'azure/storage': ['AZURE_SUBSCRIPTION_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'],
  'azure/vnet': ['AZURE_SUBSCRIPTION_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'],
  'azure/resourcegroup': ['AZURE_SUBSCRIPTION_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'],
  'azure/sql': ['AZURE_SUBSCRIPTION_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'],
  'azure/functions': ['AZURE_SUBSCRIPTION_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'],
  'azure/loadbalancer': ['AZURE_SUBSCRIPTION_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'],
  'azure/dns': ['AZURE_SUBSCRIPTION_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'],
  'azure/monitor': ['AZURE_SUBSCRIPTION_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'],
  'azure/aks': ['AZURE_SUBSCRIPTION_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'],
  'azure/cosmosdb': ['AZURE_SUBSCRIPTION_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'],
  'azure/cdn': ['AZURE_SUBSCRIPTION_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'],
  'azure/servicebus': ['AZURE_SUBSCRIPTION_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'],
  'azure/eventhub': ['AZURE_SUBSCRIPTION_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'],
  'azure/acr': ['AZURE_SUBSCRIPTION_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'],
  'azure/aci': ['AZURE_SUBSCRIPTION_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'],
  'azure/keyvault': ['AZURE_SUBSCRIPTION_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'],
  'azure/appservice': ['AZURE_SUBSCRIPTION_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'],
  'azure/activedirectory': ['AZURE_SUBSCRIPTION_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'],
  'azure/backup': ['AZURE_SUBSCRIPTION_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'],
  'azure/apim': ['AZURE_SUBSCRIPTION_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'],
  'azure/appinsights': ['AZURE_SUBSCRIPTION_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'],
  'azure/vpngateway': ['AZURE_SUBSCRIPTION_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'],
  'azure/firewall': ['AZURE_SUBSCRIPTION_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'],
  'azure/frontdoor': ['AZURE_SUBSCRIPTION_ID', 'AZURE_TENANT_ID', 'AZURE_CLIENT_ID', 'AZURE_CLIENT_SECRET'],
  // Nutanix (all use same env vars from cmd/server/main.go)
  'nutanix/aiops': ['NUTANIX_ENDPOINT', 'NUTANIX_USERNAME', 'NUTANIX_PASSWORD', 'NUTANIX_API_KEY', 'NUTANIX_INSECURE', 'PORT'],
  'nutanix/clustermgmt': ['NUTANIX_ENDPOINT', 'NUTANIX_USERNAME', 'NUTANIX_PASSWORD', 'NUTANIX_API_KEY', 'NUTANIX_INSECURE', 'PORT'],
  'nutanix/datapolicies': ['NUTANIX_ENDPOINT', 'NUTANIX_USERNAME', 'NUTANIX_PASSWORD', 'NUTANIX_API_KEY', 'NUTANIX_INSECURE', 'PORT'],
  'nutanix/dataprotection': ['NUTANIX_ENDPOINT', 'NUTANIX_USERNAME', 'NUTANIX_PASSWORD', 'NUTANIX_API_KEY', 'NUTANIX_INSECURE', 'PORT'],
  'nutanix/files': ['NUTANIX_ENDPOINT', 'NUTANIX_USERNAME', 'NUTANIX_PASSWORD', 'NUTANIX_API_KEY', 'NUTANIX_INSECURE', 'PORT'],
  'nutanix/iam': ['NUTANIX_ENDPOINT', 'NUTANIX_USERNAME', 'NUTANIX_PASSWORD', 'NUTANIX_API_KEY', 'NUTANIX_INSECURE', 'PORT'],
  'nutanix/licensing': ['NUTANIX_ENDPOINT', 'NUTANIX_USERNAME', 'NUTANIX_PASSWORD', 'NUTANIX_API_KEY', 'NUTANIX_INSECURE', 'PORT'],
  'nutanix/lifecycle': ['NUTANIX_ENDPOINT', 'NUTANIX_USERNAME', 'NUTANIX_PASSWORD', 'NUTANIX_API_KEY', 'NUTANIX_INSECURE', 'PORT'],
  'nutanix/microseg': ['NUTANIX_ENDPOINT', 'NUTANIX_USERNAME', 'NUTANIX_PASSWORD', 'NUTANIX_API_KEY', 'NUTANIX_INSECURE', 'PORT'],
  'nutanix/monitoring': ['NUTANIX_ENDPOINT', 'NUTANIX_USERNAME', 'NUTANIX_PASSWORD', 'NUTANIX_API_KEY', 'NUTANIX_INSECURE', 'PORT'],
  'nutanix/networking': ['NUTANIX_ENDPOINT', 'NUTANIX_USERNAME', 'NUTANIX_PASSWORD', 'NUTANIX_API_KEY', 'NUTANIX_INSECURE', 'PORT'],
  'nutanix/objects': ['NUTANIX_ENDPOINT', 'NUTANIX_USERNAME', 'NUTANIX_PASSWORD', 'NUTANIX_API_KEY', 'NUTANIX_INSECURE', 'PORT'],
  'nutanix/opsmgmt': ['NUTANIX_ENDPOINT', 'NUTANIX_USERNAME', 'NUTANIX_PASSWORD', 'NUTANIX_API_KEY', 'NUTANIX_INSECURE', 'PORT'],
  'nutanix/prism': ['NUTANIX_ENDPOINT', 'NUTANIX_USERNAME', 'NUTANIX_PASSWORD', 'NUTANIX_API_KEY', 'NUTANIX_INSECURE', 'PORT'],
  'nutanix/security': ['NUTANIX_ENDPOINT', 'NUTANIX_USERNAME', 'NUTANIX_PASSWORD', 'NUTANIX_API_KEY', 'NUTANIX_INSECURE', 'PORT'],
  'nutanix/vmm': ['NUTANIX_ENDPOINT', 'NUTANIX_USERNAME', 'NUTANIX_PASSWORD', 'NUTANIX_API_KEY', 'NUTANIX_INSECURE', 'PORT'],
  'nutanix/volumes': ['NUTANIX_ENDPOINT', 'NUTANIX_USERNAME', 'NUTANIX_PASSWORD', 'NUTANIX_API_KEY', 'NUTANIX_INSECURE', 'PORT'],
  // Cisco
  'cisco/meraki': ['MERAKI_API_KEY'],
  'cisco/intersight': ['INTERSIGHT_API_KEY'],
  'cisco/nexus': [],
  'cisco/dnac': [],
  'cisco/fmc': [],
  'cisco/fdm': [],
  'cisco/ise': [],
  'cisco/sdwan': [],
  'cisco/ucs': [],
  // Dell
  'dell/powerscale': ['POWERSCALE_BASE_URL', 'POWERSCALE_USERNAME', 'POWERSCALE_PASSWORD'],
  'dell/idrac': ['IDRAC_BASE_URL', 'IDRAC_USERNAME', 'IDRAC_PASSWORD'],
  'dell/ome': ['IDRAC_BASE_URL', 'IDRAC_USERNAME', 'IDRAC_PASSWORD'],
  'dell/powermax': ['IDRAC_BASE_URL', 'IDRAC_USERNAME', 'IDRAC_PASSWORD'],
  'dell/powerstore': ['IDRAC_BASE_URL', 'IDRAC_USERNAME', 'IDRAC_PASSWORD'],
  'dell/unity': ['IDRAC_BASE_URL', 'IDRAC_USERNAME', 'IDRAC_PASSWORD'],
  'dell/vxrail': ['IDRAC_BASE_URL', 'IDRAC_USERNAME', 'IDRAC_PASSWORD'],
  'dell/datadomain': ['IDRAC_BASE_URL', 'IDRAC_USERNAME', 'IDRAC_PASSWORD'],
  'dell/mx': ['IDRAC_BASE_URL', 'IDRAC_USERNAME', 'IDRAC_PASSWORD'],
  'dell/powerflex': [],
  'dell/networker': [],
  // Fortinet
  'fortinet/fortigate': ['FORTIGATE_BASE_URL', 'FORTIGATE_API_KEY'],
  'fortinet/fortimanager': ['FORTIMANAGER_BASE_URL', 'FORTIMANAGER_USERNAME', 'FORTIMANAGER_PASSWORD'],
  'fortinet/fortianalyzer': ['FORTIMANAGER_BASE_URL', 'FORTIMANAGER_USERNAME', 'FORTIMANAGER_PASSWORD'],
  'fortinet/fortiswitch': ['FORTIMANAGER_BASE_URL', 'FORTIMANAGER_USERNAME', 'FORTIMANAGER_PASSWORD'],
  'fortinet/fortiap': ['FORTIMANAGER_BASE_URL', 'FORTIMANAGER_USERNAME', 'FORTIMANAGER_PASSWORD'],
  // Palo Alto
  'paloalto/panos': [],
  'paloalto/panorama': ['PANORAMA_HOSTNAME', 'PANORAMA_USERNAME', 'PANORAMA_PASSWORD', 'PANORAMA_API_KEY'],
  'paloalto/prisma-access': ['PRISMA_ACCESS_TENANT_ID', 'PRISMA_ACCESS_CLIENT_ID', 'PRISMA_ACCESS_CLIENT_SECRET'],
  'paloalto/prisma-cloud': ['PRISMA_CLOUD_API_URL', 'PRISMA_CLOUD_ACCESS_KEY', 'PRISMA_CLOUD_SECRET_KEY'],
  'paloalto/cortex-xdr': ['CORTEX_XDR_FQDN', 'CORTEX_XDR_API_KEY', 'CORTEX_XDR_API_KEY_ID'],
  // Pure Storage
  'purestorage/flasharray': ['PURE_API_TOKEN'],
  'purestorage/flashblade': ['FLASHBLADE_API_TOKEN'],
  'purestorage/pure1': ['PURE1_APP_ID', 'PURE1_PRIVATE_KEY'],
  'purestorage/portworx': ['PORTWORX_ENDPOINT', 'PORTWORX_TOKEN'],
  // Google Cloud
  'gcp/compute': ['GCP_PROJECT_ID', 'GOOGLE_APPLICATION_CREDENTIALS'],
  'gcp/storage': ['GCP_PROJECT_ID', 'GOOGLE_APPLICATION_CREDENTIALS'],
  'gcp/bigquery': ['GCP_PROJECT_ID', 'GOOGLE_APPLICATION_CREDENTIALS'],
  'gcp/sql': ['GCP_PROJECT_ID', 'GOOGLE_APPLICATION_CREDENTIALS'],
  'gcp/dns': ['GCP_PROJECT_ID', 'GOOGLE_APPLICATION_CREDENTIALS'],
  'gcp/monitoring': ['GCP_PROJECT_ID', 'GOOGLE_APPLICATION_CREDENTIALS'],
  'gcp/run': ['GCP_PROJECT_ID', 'GOOGLE_APPLICATION_CREDENTIALS'],
  'gcp/vpc': ['GCP_PROJECT_ID', 'GOOGLE_APPLICATION_CREDENTIALS'],
  'gcp/spanner': ['GCP_PROJECT_ID', 'GOOGLE_APPLICATION_CREDENTIALS'],
  'gcp/functions': ['GCP_PROJECT_ID', 'GOOGLE_APPLICATION_CREDENTIALS'],
  'gcp/pubsub': ['GCP_PROJECT_ID', 'GOOGLE_APPLICATION_CREDENTIALS'],
  'gcp/registry': ['GCP_PROJECT_ID', 'GOOGLE_APPLICATION_CREDENTIALS'],
  'gcp/armor': ['GCP_PROJECT_ID', 'GOOGLE_APPLICATION_CREDENTIALS'],
  'gcp/gke': ['GCP_PROJECT_ID', 'GOOGLE_APPLICATION_CREDENTIALS'],
  'gcp/iam': ['GCP_PROJECT_ID', 'GOOGLE_APPLICATION_CREDENTIALS'],
  'gcp/loadbalancing': ['GCP_PROJECT_ID', 'GOOGLE_APPLICATION_CREDENTIALS'],
  'gcp/secretmanager': ['GCP_PROJECT_ID', 'GOOGLE_APPLICATION_CREDENTIALS'],
  'gcp/firestore': ['GCP_PROJECT_ID', 'GOOGLE_APPLICATION_CREDENTIALS'],
  'gcp/kms': ['GCP_PROJECT_ID', 'GOOGLE_APPLICATION_CREDENTIALS'],
  'gcp/cdn': ['GCP_PROJECT_ID', 'GOOGLE_APPLICATION_CREDENTIALS'],
  // Ubiquiti (if present in JSON)
  'ubiquiti/sitemanager': ['UBIQUITI_API_KEY', 'UBIQUITI_BASE_URL', 'MCP_PORT'],
  // F5 (5 read-only MCPs in f5/)
  'f5/bigip': ['BIGIP_URL', 'BIGIP_USERNAME', 'BIGIP_PASSWORD', 'BIGIP_AUTH_TOKEN', 'BIGIP_INSECURE', 'MCP_PORT'],
  'f5/bigiq': ['BIGIQ_URL', 'BIGIQ_USERNAME', 'BIGIQ_PASSWORD', 'BIGIQ_AUTH_TOKEN', 'BIGIQ_INSECURE', 'MCP_PORT'],
  'f5/bigip-next': ['BIGNEXT_URL', 'BIGNEXT_USERNAME', 'BIGNEXT_PASSWORD', 'BIGNEXT_BEARER_TOKEN', 'BIGNEXT_INSECURE', 'MCP_PORT'],
  'f5/distributed-cloud': ['XC_URL', 'XC_API_TOKEN', 'XC_INSECURE', 'MCP_PORT'],
  'f5/nginx-one': ['NGINX_ONE_URL', 'NGINX_ONE_USERNAME', 'NGINX_ONE_PASSWORD', 'NGINX_ONE_JWT', 'NGINX_ONE_INSECURE', 'MCP_PORT'],
};

// Product name (as in JSON) -> directory name, per vendor (when not simple lowercase)
const PRODUCT_TO_DIR = {
  'AWS': {
    'Elastic Load Balancing': 'elb',
    'Route53': 'route53',
    'Systems Manager': 'systemsmgr',
  },
  'Azure': {
    'Virtual Machines': 'vm',
    'Storage Accounts': 'storage',
    'Virtual Networks': 'vnet',
    'Resource Groups': 'resourcegroup',
    'SQL Database': 'sql',
    'Load Balancer': 'loadbalancer',
    'Kubernetes Service': 'aks',
    'Cosmos DB': 'cosmosdb',
    'Service Bus': 'servicebus',
    'Event Hubs': 'eventhub',
    'Container Registry': 'acr',
    'Container Instances': 'aci',
    'Key Vault': 'keyvault',
    'App Service': 'appservice',
    'Active Directory': 'activedirectory',
  },
  'Nutanix': {
    'AIOps': 'aiops',
    'Cluster Management': 'clustermgmt',
    'Data Policies': 'datapolicies',
    'Data Protection': 'dataprotection',
    'Identity and Access Management': 'iam',
    'Life Cycle Management': 'lifecycle',
    'Flow Microsegmentation': 'microseg',
    'Operations Management': 'opsmgmt',
    'Virtual Machine Management': 'vmm',
  },
  'Cisco': {
    'Nexus NX-API': 'nexus',
    'DNA Center': 'dnac',
    'Meraki Dashboard': 'meraki',
    'Firewall Management Center': 'fmc',
    'Firepower Device Manager': 'fdm',
    'Identity Services Engine': 'ise',
    'SD-WAN vManage': 'sdwan',
    'UCS Manager': 'ucs',
  },
  'Dell': {
    'OpenManage Enterprise': 'ome',
  },
  'Palo Alto Networks': {
    'PAN-OS': 'panos',
    'Prisma Access': 'prisma-access',
    'Cortex XDR': 'cortex-xdr',
    'Prisma Cloud': 'prisma-cloud',
  },
  'Ubiquiti': {
    'Site Manager': 'sitemanager',
  },
  'F5': {
    'BIG-IP': 'bigip',
    'BIG-IQ': 'bigiq',
    'BIG-IP Next Central Manager': 'bigip-next',
    'Distributed Cloud (XC)': 'distributed-cloud',
    'NGINX One (Instance Manager)': 'nginx-one',
  },
  'Google Cloud': {
    'Compute Engine': 'compute',
    'Cloud Storage': 'storage',
    'Cloud DNS': 'dns',
    'Cloud Run': 'run',
    'Cloud VPC': 'vpc',
    'Cloud Spanner': 'spanner',
    'Cloud Functions': 'functions',
    'Pub/Sub': 'pubsub',
    'Artifact Registry': 'registry',
    'Cloud Armor': 'armor',
    'Kubernetes Engine': 'gke',
    'Cloud Load Balancing': 'loadbalancing',
    'Secret Manager': 'secretmanager',
    'Cloud KMS': 'kms',
    'Cloud CDN': 'cdn',
  },
};

function productToDir(vendor, product) {
  const v = PRODUCT_TO_DIR[vendor];
  if (v && v[product]) return v[product];
  return product.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function vendorToDir(vendor) {
  const m = {
    'Palo Alto Networks': 'paloalto',
    'Google Cloud': 'gcp',
    'Pure Storage': 'purestorage',
    'Juniper Networks': 'juniper',
    'Check Point': 'checkpoint',
    'Rackspace': 'rackspace',
  };
  return m[vendor] || vendor.toLowerCase().replace(/\s+/g, '');
}

function getPathKey(vendor, product) {
  const vDir = vendorToDir(vendor);
  const pDir = productToDir(vendor, product);
  return `${vDir}/${pDir}`;
}

function main() {
  const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  let matched = 0;
  data.servers.forEach((server) => {
    const pathKey = getPathKey(server.vendor, server.product);
    const envVars = PATH_ENV_MAP[pathKey];
    server.environmental_variables = Array.isArray(envVars) ? [...envVars] : [];
    if (server.environmental_variables.length > 0) matched++;
  });
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Updated mcp-servers.json: ${matched} servers have environmental_variables, ${data.servers.length} total.`);
}

main();
