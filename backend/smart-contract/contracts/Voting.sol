// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Voting {

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    struct Voter {
        bool hasVoted;
        uint votedCandidateId;
    }

    address public admin;
    uint public candidateCount;

    mapping(uint => Candidate) public candidates;
    mapping(address => Voter) public voters;

    constructor() {
        admin = msg.sender;
    }

    function addCandidate(string memory _name) public {
        require(msg.sender == admin, "Only admin can add candidates");

        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, _name, 0);
    }

    function vote(uint _candidateId) public {
        require(!voters[msg.sender].hasVoted, "Already voted");
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedCandidateId = _candidateId;

        candidates[_candidateId].voteCount++;
    }

    function getCandidate(uint _id) public view returns (
        uint, string memory, uint
    ) {
        Candidate memory c = candidates[_id];
        return (c.id, c.name, c.voteCount);
    }
}