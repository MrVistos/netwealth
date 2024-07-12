# NetWealth

![NetWealth](https://github.com/MrVistos/netwealth/blob/main/icons/icon.png?raw=true)

**NetWealth** is an innovative blockchain project that leverages a robust and extensive API to cater to a wide range of use cases. Our platform aims to provide comprehensive solutions, enabling seamless integration and interaction with various applications and services. Whether for financial management, asset tracking, or decentralized applications, NetWealth's powerful API ensures versatility and adaptability, empowering developers and businesses to harness the full potential of blockchain technology.

**Virus-Network** is an idea to guarantee communication in the network even without masternodes or central communication nodes. If any of the netnodes in the network are reachable the blockchain remains robust and functional.

**NetNode** is the idea to deliver a all-in-one solution for the user. No more setup of complicated nodes or services. You set your origin, forward your port and you are to go to act as netnode. Each netnode will share all known peers to each netnode in the network. 

# Manual
## settings.json
```
{
    "port": 9000, <- This is your local port you want to use
    "origin": "192.168.0.176:9000", <- This is the origin node you want to connect when you run your netnode the first time
    "isOrigin": 0 <- You only set this to 1 if you want to act as main netnode (e. g. you are the first netnode in network)
}
```


# Plan
- Implement **virus-network** and verify all netnodes can work without any main netnode or "masternodes". ✅
- Implement **blockchain** and integrate a proof-of-stake algorithm. ❌
- Implement API to enable third party platforms and applications to interact with the netnode. ❌
- Implement test cases and test environments. ❌
- Setup and run a testnet to verify security and robustness. ❌
- Setup Github actions (CI/CD) for continous releases. ❌
- Crosscompile executable for delivery. ❌
- Order a pizza and enjoy. ❌

# How to contribute
If you want contribute to this project feel free to create a branch. When you are done open a merge request and choose development as target branch.
Once a milestone from the plan is completed the development branch will be merge into the main branch and a release will be build.
