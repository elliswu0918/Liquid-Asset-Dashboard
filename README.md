# **Liquid Asset Dashboard** 🚀

### **Project Description**  
Liquid Asset Dashboard is a visual blockchain transaction analyzer designed for the Liquid Network. It allows users to input asset IDs, visualize transaction topologies, and explore transaction details interactively. The platform features alerts for high-fee transactions and a comprehensive network graph.


---

## **Features** 🎯  

1. **Asset Search:**  
   Enter an asset ID to fetch and visualize transaction data.

2. **Dynamic Network Visualization:**  
   View transaction network topology using Cytoscape.js.

3. **Node Detail Panel:**  
   Click any transaction node to display detailed information, including transaction size, weight, and fees.

4. **High-Fee Alerts:**  
   Receive alerts when a transaction fee exceeds a configured threshold.

---

## **How to Use** 🖥️  

1. **Open the Browser and Load the Page.**  
2. **Enter the Asset ID** (e.g., `ce091c998b83c78bb71a632313ba3760f1763d9cfcffae02258ffa9865a37bd2`).  
3. **Set Alerts (Optional):**  
   - **Transaction Amount Threshold (L-BTC):** Enter the minimum transaction amount to monitor.  
   - **Fee Threshold (Satoshis):** Enter the minimum fee to trigger an alert.  

4. **Click the "Fetch Transactions" Button.**  

5. **View the Topology and Detailed Information:**  
   - **Inspect Nodes:** Click any node to inspect its detailed transaction data. The node will turn **red**.  
   - **Update the Topology:** Click another node to explore its transaction network.  

6. **High Fee Alerts:**  
   - If a transaction's fee exceeds the **Fee Threshold**, an alert box will appear with a message like:  
     > 🚨 **High Fee Alert!** Transaction `txid` has a fee of `fee_amount` satoshis.  
   - **Dismiss the Alert:** Click the alert box to close it.  
---
## **License** 📄  

This project is licensed under the [MIT License](LICENSE). 
