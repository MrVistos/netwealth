# NetWealth

[<img src="https://github.com/MrVistos/netwealth/blob/main/icons/icon.png?raw=true">](https://github.com/MrVistos/netwealth)

**NetWealth** is an innovative blockchain project that leverages a robust and extensive API to cater to a wide range of use cases. Our platform aims to provide comprehensive solutions, enabling seamless integration and interaction with various applications and services. Whether for financial management, asset tracking, or decentralized applications, NetWealth's powerful API ensures versatility and adaptability, empowering developers and businesses to harness the full potential of blockchain technology.

**Virus-Network** is an idea to guarantee communication in the network even without masternodes or central communication nodes. If any of the netnodes in the network are reachable the blockchain remains robust and functional. (Initially I wanted to name it Net-Network, but that sounds stupid, right?)

**NetNode** is the idea to deliver a all-in-one solution for the user. No more setup of complicated nodes or services. You set your origin, forward your port and you are to go to act as netnode. Each netnode will share all known peers to each netnode in the network. 

# Manual
## settings.json
```
{
    "port": 9000, <- This is your local port you want to use
    "origin": "192.168.0.176:9000", <- This is the remote netnode you want to connect with when you run your netnode the first time
    "isOrigin": 0 <- You only set this to 1 if you want to act as main netnode (e. g. you are the first netnode in network)
}
```


# Plan
- Implement **virus-network** and verify all netnodes can work without any main netnode or "masternodes". ✅
- Implement **blockchain** and integrate a proof-of-stake algorithm. 🚧
- Implement API to enable third party platforms and applications to interact with the netnode. 🚧
- Implement test cases and test environments. ❌
- Setup and run a testnet to verify security and robustness. ❌
- Setup Github actions (CI/CD) for continous releases. ❌
- Crosscompile executable for delivery. ❌
- Order a pizza and enjoy. ❌

# How to contribute
If you want contribute to this project feel free to create a branch and start working!
Once the work is done the branch can be merged into the main branch and a release will be build.

[<img src="https://camo.githubusercontent.com/b15646585366435f766c6e4e0e1999d2a6ea59925bb78836519aabd882169c59/68747470733a2f2f63646e2e7261776769742e636f6d2f4e4e54696e2f646973636f72642d6c6f676f2f66343333333334342f7372632f6173736574732f616e696d61746564646973636f72642e737667">](https://discord.gg/QZx2AH5b7t)
