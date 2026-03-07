// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(uint256 => uint256)) public voteCount;

    event VoteCast(uint256 indexed electionId, uint256 indexed candidateId, address indexed voter);

    function castVote(uint256 electionId, uint256 candidateId) external {
        require(!hasVoted[electionId][msg.sender], "Already voted");
        hasVoted[electionId][msg.sender] = true;
        voteCount[electionId][candidateId] += 1;
        emit VoteCast(electionId, candidateId, msg.sender);
    }
}
