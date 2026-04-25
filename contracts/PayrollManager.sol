// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title PayrollManager
 * @dev Manages organization employees and facilitates batch salary payments.
 * Built for EnigmaPay MVP using Solidity best practices.
 */
contract PayrollManager {
    address public owner;
    
    struct Employee {
        address wallet;
        uint256 salary; // in wei (Native or Token base units)
        bool isActive;
        string name;
    }
    
    // Using mapping for O(1) lookup and an array for iteration
    mapping(address => Employee) public employees;
    address[] public employeeRegistry;
    
    event EmployeeAdded(address indexed wallet, string name, uint256 salary);
    event EmployeeRemoved(address indexed wallet);
    event SalaryPaid(address indexed recipient, uint256 amount);
    event BatchExecuted(uint256 totalAmount, uint256 count);

    modifier onlyOwner() {
        require(msg.sender == owner, "EnigmaPay: Unauthorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Add or update an employee in the system.
     */
    function addEmployee(address _wallet, string memory _name, uint256 _salary) external onlyOwner {
        require(_wallet != address(0), "EnigmaPay: Zero address");
        require(_salary > 0, "EnigmaPay: Invalid salary");
        
        if (!employees[_wallet].isActive) {
            employeeRegistry.push(_wallet);
        }
        
        employees[_wallet] = Employee({
            wallet: _wallet,
            salary: _salary,
            isActive: true,
            name: _name
        });
        
        emit EmployeeAdded(_wallet, _name, _salary);
    }

    /**
     * @dev Deactivate an employee from payroll.
     */
    function removeEmployee(address _wallet) external onlyOwner {
        require(employees[_wallet].isActive, "EnigmaPay: Not found");
        employees[_wallet].isActive = false;
        emit EmployeeRemoved(_wallet);
    }

    /**
     * @dev Batch payment execution. 
     * Uses Call pattern to prevent common gas limit issues with transfer().
     */
    function executeBatchSalary() external payable onlyOwner {
        uint256 totalRequired = 0;
        uint256 paidCount = 0;
        
        // Validation loop
        for (uint256 i = 0; i < employeeRegistry.length; i++) {
            address empAddr = employeeRegistry[i];
            if (employees[empAddr].isActive) {
                totalRequired += employees[empAddr].salary;
                paidCount++;
            }
        }
        
        require(msg.value >= totalRequired, "EnigmaPay: Insufficient ETH sent");
        
        // Distribution loop (Checks-Effects-Interactions)
        for (uint256 i = 0; i < employeeRegistry.length; i++) {
            address empAddr = employeeRegistry[i];
            if (employees[empAddr].isActive) {
                uint256 amount = employees[empAddr].salary;
                (bool success, ) = empAddr.call{value: amount}("");
                require(success, "EnigmaPay: Transfer failed");
                emit SalaryPaid(empAddr, amount);
            }
        }
        
        emit BatchExecuted(totalRequired, paidCount);
    }

    /**
     * @dev Drain contract balance of any surplus or locked funds.
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    receive() external payable {}
}
