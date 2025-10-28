# MCP Servers Data Repository

This directory contains the centralized data for all **84 certified MCP servers** in the Operator+ platform.

## 📁 What's Here

### `mcp-servers.json`
Complete catalog of all MCP servers with:
- Vendor information
- Product name
- API version
- Description
- Requirements
- Categories/tags
- Documentation URLs

---

## 📊 Overview

### Total: **84 MCP Servers**

| Vendor | Count | Categories |
|--------|-------|------------|
| **AWS** | 20 | Compute, Storage, Database, Networking, Security, Serverless, Containers, Monitoring |
| **Azure** | 20 | Compute, Storage, Database, Networking, Security, Serverless, Containers, Monitoring |
| **Nutanix** | 17 | AIOps, Cluster Management, Data Protection, Files, IAM, Licensing, LCM, Monitoring, Networking, Objects, Security, VMM, Volumes |
| **Dell** | 11 | PowerFlex, Networker, PowerScale, DataDomain, iDRAC, MX, OME, PowerMax, PowerStore, Unity, VxRail |
| **Cisco** | 9 | Nexus, DNA Center, Meraki, FMC, FDM, ISE, SD-WAN, UCS, Intersight |
| **VMware** | 2 | vSphere, NSX Autonomous Edge |
| **Palo Alto Networks** | 1 | PAN-OS Firewall |
| **Pure Storage** | 1 | FlashArray |
| **Fortinet** | 1 | FortiGate |
| **Akamai** | 1 | EdgeGrid (CDN/Edge) |
| **Linode** | 1 | Cloud API |

---

## 🎯 Use Cases

### For Website
The JSON file is used by the Operator+ website to:
- Dynamically render the marketplace
- Power search functionality
- Enable vendor filtering
- Display accurate counts

### For Applications
Other applications can consume this data to:
- Build custom MCP browsers
- Generate documentation
- Create deployment scripts
- Validate MCP availability

---

## 📖 JSON Structure

```json
{
  "servers": [
    {
      "vendor": "Vendor Name",
      "product": "Product Name",
      "apiVersion": "x.y",
      "description": "What this MCP does...",
      "requirements": "Auth type; Protocol",
      "category": ["Category1", "Category2"],
      "docsUrl": "https://docs.vendor.com/"
    }
  ]
}
```

### Field Descriptions

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `vendor` | string | Vendor/company name | "AWS", "Nutanix", "Cisco" |
| `product` | string | Product/service name | "EC2", "AIOps", "Nexus" |
| `apiVersion` | string | API version number | "4.1", "2024", "Latest" |
| `description` | string | What the MCP does | "Manage VMs and compute..." |
| `requirements` | string | Auth & connection requirements | "API key; HTTPS" |
| `category` | array | Tags for categorization | ["Cloud", "Compute"] |
| `docsUrl` | string | Link to vendor docs | "https://docs..." |

---

## 🔗 Public Access

### GitHub Raw URL
```
https://raw.githubusercontent.com/YOUR_USERNAME/operator-plus/main/mcp-servers/mcp-servers.json
```

### jsDelivr CDN (Recommended for Production)
```
https://cdn.jsdelivr.net/gh/YOUR_USERNAME/operator-plus@main/mcp-servers/mcp-servers.json
```

### CORS-Enabled
The file can be fetched from any domain:
```javascript
fetch('https://cdn.jsdelivr.net/gh/YOUR_USERNAME/operator-plus@main/mcp-servers/mcp-servers.json')
  .then(res => res.json())
  .then(data => console.log(data.servers));
```

---

## ✏️ Updating the Data

### Adding a New MCP Server

1. **Edit** `mcp-servers.json`
2. **Add** new server object to the `servers` array:
   ```json
   {
     "vendor": "NewVendor",
     "product": "NewProduct",
     "apiVersion": "1.0",
     "description": "Description here...",
     "requirements": "API key; HTTPS",
     "category": ["Infrastructure"],
     "docsUrl": "https://docs.newvendor.com/"
   }
   ```
3. **Commit** and push to GitHub
4. **Website updates automatically** on next page load!

### Updating an Existing MCP

1. Find the MCP in the `servers` array
2. Edit the fields you need
3. Commit and push
4. Done!

---

## 🚀 Usage Examples

### JavaScript (Browser)
```javascript
fetch('./mcp-servers.json')
  .then(res => res.json())
  .then(data => {
    console.log(`Total MCPs: ${data.servers.length}`);
    
    // Filter by vendor
    const awsServers = data.servers.filter(s => s.vendor === 'AWS');
    console.log(`AWS MCPs: ${awsServers.length}`);
    
    // Filter by category
    const securityMCPs = data.servers.filter(s => 
      s.category.includes('Security')
    );
  });
```

### Node.js
```javascript
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./mcp-servers.json', 'utf8'));
console.log(`Total servers: ${data.servers.length}`);
```

### Python
```python
import json

with open('mcp-servers.json', 'r') as f:
    data = json.load(f)
    
print(f"Total MCPs: {len(data['servers'])}")

# Filter by vendor
aws_mcps = [s for s in data['servers'] if s['vendor'] == 'AWS']
print(f"AWS MCPs: {len(aws_mcps)}")
```

### CLI (jq)
```bash
# Count total servers
jq '.servers | length' mcp-servers.json

# List all vendors
jq '.servers[].vendor' mcp-servers.json | sort -u

# Filter by vendor
jq '.servers[] | select(.vendor == "AWS")' mcp-servers.json

# Count by vendor
jq '[.servers[] | .vendor] | group_by(.) | map({vendor: .[0], count: length})' mcp-servers.json
```

---

## 📈 Statistics

### By Category

- **Cloud Infrastructure**: 40 (AWS 20 + Azure 20)
- **On-Premise Infrastructure**: 17 (Nutanix)
- **Networking**: 13 (Cisco 9 + others)
- **Storage**: 12 (Dell + Nutanix + Pure)
- **Security**: 8 (Firewalls, IAM, encryption)
- **Compute**: 11 (VMware, Nutanix, Cloud VMs)

### By Authentication Type

- **API Key**: 15 servers
- **AWS SigV4**: 20 servers
- **Azure AD**: 20 servers
- **Basic Auth**: 10 servers
- **Token/Session**: 12 servers
- **OAuth 2.0**: 7 servers

---

## 🔍 Search & Filter

The JSON structure supports flexible querying:

### Search by Keyword
```javascript
const searchTerm = 'kubernetes';
const results = data.servers.filter(s => 
  s.description.toLowerCase().includes(searchTerm) ||
  s.product.toLowerCase().includes(searchTerm) ||
  s.category.some(c => c.toLowerCase().includes(searchTerm))
);
```

### Filter by Multiple Vendors
```javascript
const cloudVendors = ['AWS', 'Azure', 'Linode'];
const cloudMCPs = data.servers.filter(s => 
  cloudVendors.includes(s.vendor)
);
```

### Filter by Category
```javascript
const storageMCPs = data.servers.filter(s => 
  s.category.includes('Storage')
);
```

---

## 🌐 Integration with Website

The `../website/index.html` uses this JSON file to:

1. **Fetch** the data on page load
2. **Render** 84 MCP cards dynamically
3. **Filter** by vendor (9 filter buttons)
4. **Search** across all fields in real-time
5. **Display** accurate counts automatically

No database, no CMS, just JSON! 🎉

---

## 📝 Maintenance

### Monthly Review Checklist

- [ ] Verify API versions are current
- [ ] Update descriptions if features changed
- [ ] Add new MCP servers as they're certified
- [ ] Remove deprecated/sunset MCPs
- [ ] Update documentation URLs
- [ ] Validate JSON structure (use jsonlint.com)

### Validation

Before committing changes:

```bash
# Validate JSON syntax
cat mcp-servers.json | python3 -m json.tool > /dev/null

# Or use jq
jq empty mcp-servers.json

# Or online
# https://jsonlint.com/
```

---

## 🔒 Security

### Read-Only by Design
All 84 MCP servers provide **read-only** access:
- ✅ No resource creation
- ✅ No configuration changes
- ✅ No deletions
- ✅ Safe for monitoring, auditing, compliance

### Authentication Requirements
Each MCP server specifies its auth requirements in the `requirements` field:
- API keys
- Service principals
- Bearer tokens
- OAuth 2.0
- Basic auth
- Session/cookie auth

---

## 📚 Related Documentation

- [Website README](../website/README.md) - How the website uses this data
- [AWS MCPs](../aws/README.md) - 20 AWS service integrations
- [Azure MCPs](../azure/README.md) - 20 Azure service integrations
- [Cisco MCPs](../cisco/README.md) - 9 Cisco platform integrations
- [Dell MCPs](../dell/README.md) - 11 Dell product integrations
- [Nutanix MCPs](../nutanix/README.md) - 17 Nutanix module integrations

---

## 🎯 Quick Stats

```
📊 Total MCPs: 84
🏢 Vendors: 11
🔧 Categories: 15+
🌍 Global Coverage: On-prem + Multi-cloud
🔒 Security: 100% Read-Only
✅ Status: All Certified
```

---

## 📞 Questions?

For questions about:
- **Data format**: Check the JSON structure above
- **Adding MCPs**: Follow the "Updating the Data" section
- **Website integration**: See `../website/README.md`
- **Individual MCPs**: Check vendor-specific READMEs

---

**Last Updated**: October 28, 2025  
**Format Version**: 1.0  
**MCP Count**: 84 servers

