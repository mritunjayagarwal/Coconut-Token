pragma solidity ^0.5.16;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Token {
    using SafeMath for uint;

    // Variable
    string public name = "Coconut Token";
    string public symbol = "COCO";
    uint256 public decimals = 18;
    uint256 public totalSupply;

    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    //Track balances
    mapping(address => uint256) public balanceOf;

    //Track how many tokens the exchange is allowed to trade
    mapping(address => mapping(address => uint256)) public allowance;

 
    constructor() public{
        totalSupply = 1000000 * (10 ** decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    //Transfer tokens
    function transfer(address _to, uint256 _value) public returns (bool success){
        require(_to != address(0));
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    //APPROVE TOKENS SO THAT CRYPTO EXCHANGES CAN SPEND AND RECEIVE OUR TOKENS FOR US WITHOUT MAKING IT THEIRS
    function approve(address _spender, uint256 _value) public returns(bool success){
        require(_spender != address(0));
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

}