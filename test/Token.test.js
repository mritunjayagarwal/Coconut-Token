const Token = artifacts.require("./Token");

require('chai') //used for testing purposes
.use(require('chai-as-promised'))
.should()
contract('Token', (accounts) => {
    describe('deployment', () => {
        it('tracks the name', async () => {
            const  token = await Token.new(); //same as const token = await Token.deployed();
            const result = await token.name();
            result.should.equal('My Name');
            //Fetch token from blockchain
            //Read token name here....
            //The token name is 'My Name'

        })
    })
})
