// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RewardManager {
    string public name = "HealthToken";
    string public symbol = "HLT";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    address public owner;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 value, string reason);
    event Burn(address indexed from, uint256 value, string reason);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(to != address(0), "Invalid address");
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        _balances[msg.sender] -= amount;
        _balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function allowance(address ownerAddr, address spender) public view returns (uint256) {
        return _allowances[ownerAddr][spender];
    }

    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(to != address(0), "Invalid address");
        uint256 currentAllowance = _allowances[from][msg.sender];
        require(currentAllowance >= amount, "Allowance exceeded");
        require(_balances[from] >= amount, "Insufficient balance");
        _allowances[from][msg.sender] = currentAllowance - amount;
        _balances[from] -= amount;
        _balances[to] += amount;
        emit Transfer(from, to, amount);
        return true;
    }

    function mint(address to, uint256 amount, string memory reason) public onlyOwner {
        require(to != address(0), "Invalid address");
        _balances[to] += amount;
        totalSupply += amount;
        emit Mint(to, amount, reason);
        emit Transfer(address(0), to, amount);
    }

    function burn(address from, uint256 amount, string memory reason) public onlyOwner {
        require(from != address(0), "Invalid address");
        require(_balances[from] >= amount, "Insufficient balance");
        _balances[from] -= amount;
        totalSupply -= amount;
        emit Burn(from, amount, reason);
        emit Transfer(from, address(0), amount);
    }
}



