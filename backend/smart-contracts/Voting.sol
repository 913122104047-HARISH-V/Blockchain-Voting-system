// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StateElectionVoting {
    address public admin;

    struct Election {
        uint256 id;
        string title;
        string stateName;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        bool resultsPublished;
        bool exists;
    }

    struct Constituency {
        uint256 id;
        string name;
        string stateName;
        bool exists;
    }

    struct Candidate {
        uint256 id;
        string name;
        string party;
        uint256 constituencyId;
        uint256 voteCount;
        bool isActive;
    }

    struct VoterRegistration {
        bool isRegistered;
        uint256 constituencyId;
        bool hasVoted;
    }

    uint256 public electionCounter;
    uint256 public constituencyCounter;
    uint256 public candidateCounter;

    mapping(uint256 => Election) public elections;
    mapping(uint256 => Constituency) public constituencies;
    mapping(uint256 => Candidate[]) private electionCandidates;
    mapping(uint256 => mapping(address => VoterRegistration)) public electionVoters;

    event ElectionCreated(uint256 indexed electionId, string title, string stateName);
    event ElectionStarted(uint256 indexed electionId);
    event ElectionEnded(uint256 indexed electionId);
    event ConstituencyCreated(
        uint256 indexed constituencyId,
        string name,
        string stateName
    );
    event CandidateAdded(
        uint256 indexed electionId,
        uint256 indexed candidateId,
        string candidateName,
        uint256 constituencyId
    );
    event VoterRegistered(
        uint256 indexed electionId,
        address indexed voter,
        uint256 constituencyId
    );
    event VoteCast(
        address indexed voter,
        uint256 indexed electionId,
        uint256 indexed candidateId
    );
    event ResultsPublished(uint256 indexed electionId);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin allowed");
        _;
    }

    modifier electionExists(uint256 electionId) {
        require(elections[electionId].exists, "Election does not exist");
        _;
    }

    modifier constituencyExists(uint256 constituencyId) {
        require(constituencies[constituencyId].exists, "Constituency does not exist");
        _;
    }

    function createElection(
        string memory title,
        string memory stateName,
        uint256 startTime,
        uint256 endTime
    ) external onlyAdmin {
        require(bytes(title).length > 0, "Title required");
        require(bytes(stateName).length > 0, "State required");
        require(startTime < endTime, "Invalid time range");
        require(endTime > block.timestamp, "End time must be in the future");

        electionCounter++;

        elections[electionCounter] = Election({
            id: electionCounter,
            title: title,
            stateName: stateName,
            startTime: startTime,
            endTime: endTime,
            isActive: false,
            resultsPublished: false,
            exists: true
        });

        emit ElectionCreated(electionCounter, title, stateName);
    }

    function createConstituency(
        string memory name,
        string memory stateName
    ) external onlyAdmin {
        require(bytes(name).length > 0, "Constituency name required");
        require(bytes(stateName).length > 0, "State required");

        constituencyCounter++;

        constituencies[constituencyCounter] = Constituency({
            id: constituencyCounter,
            name: name,
            stateName: stateName,
            exists: true
        });

        emit ConstituencyCreated(constituencyCounter, name, stateName);
    }

    function startElection(
        uint256 electionId
    ) external onlyAdmin electionExists(electionId) {
        Election storage election = elections[electionId];

        require(!election.isActive, "Election already active");
        require(!election.resultsPublished, "Results already published");
        require(block.timestamp >= election.startTime, "Election not started yet");
        require(block.timestamp < election.endTime, "Election already ended");
        require(electionCandidates[electionId].length > 0, "No candidates added");

        election.isActive = true;

        emit ElectionStarted(electionId);
    }

    function endElection(
        uint256 electionId
    ) external onlyAdmin electionExists(electionId) {
        Election storage election = elections[electionId];

        require(election.isActive, "Election is not active");

        election.isActive = false;

        emit ElectionEnded(electionId);
    }

    function registerVoter(
        uint256 electionId,
        address voter,
        uint256 constituencyId
    )
        external
        onlyAdmin
        electionExists(electionId)
        constituencyExists(constituencyId)
    {
        require(voter != address(0), "Invalid voter address");

        Election storage election = elections[electionId];
        Constituency storage constituency = constituencies[constituencyId];

        require(
            _sameString(election.stateName, constituency.stateName),
            "Constituency does not belong to election state"
        );

        electionVoters[electionId][voter] = VoterRegistration({
            isRegistered: true,
            constituencyId: constituencyId,
            hasVoted: false
        });

        emit VoterRegistered(electionId, voter, constituencyId);
    }

    function addCandidate(
        uint256 electionId,
        string memory name,
        string memory party,
        uint256 constituencyId
    )
        external
        onlyAdmin
        electionExists(electionId)
        constituencyExists(constituencyId)
    {
        require(bytes(name).length > 0, "Candidate name required");
        require(bytes(party).length > 0, "Party name required");

        Election storage election = elections[electionId];
        Constituency storage constituency = constituencies[constituencyId];

        require(
            _sameString(election.stateName, constituency.stateName),
            "Candidate constituency outside election state"
        );

        candidateCounter++;

        electionCandidates[electionId].push(
            Candidate({
                id: candidateCounter,
                name: name,
                party: party,
                constituencyId: constituencyId,
                voteCount: 0,
                isActive: true
            })
        );

        emit CandidateAdded(electionId, candidateCounter, name, constituencyId);
    }

    function setCandidateStatus(
        uint256 electionId,
        uint256 candidateId,
        bool isActive
    ) external onlyAdmin electionExists(electionId) {
        Candidate[] storage candidates = electionCandidates[electionId];
        bool found;

        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].id == candidateId) {
                candidates[i].isActive = isActive;
                found = true;
                break;
            }
        }

        require(found, "Candidate not found");
    }

    function vote(uint256 electionId, uint256 candidateId) external electionExists(electionId) {
        Election storage election = elections[electionId];

        require(election.isActive, "Election not active");
        require(
            block.timestamp >= election.startTime &&
                block.timestamp <= election.endTime,
            "Voting closed"
        );

        VoterRegistration storage voter = electionVoters[electionId][msg.sender];

        require(voter.isRegistered, "Voter not registered");
        require(!voter.hasVoted, "Already voted");

        Candidate[] storage candidates = electionCandidates[electionId];
        bool candidateFound;

        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].id == candidateId) {
                require(candidates[i].isActive, "Candidate inactive");
                require(
                    candidates[i].constituencyId == voter.constituencyId,
                    "Candidate not in voter's constituency"
                );

                candidates[i].voteCount++;
                candidateFound = true;
                break;
            }
        }

        require(candidateFound, "Invalid candidate");

        voter.hasVoted = true;

        emit VoteCast(msg.sender, electionId, candidateId);
    }

    function publishResults(
        uint256 electionId
    ) external onlyAdmin electionExists(electionId) {
        Election storage election = elections[electionId];

        require(block.timestamp > election.endTime, "Election still running");
        require(!election.isActive, "End election before publishing");
        require(!election.resultsPublished, "Results already published");

        election.resultsPublished = true;

        emit ResultsPublished(electionId);
    }

    function getCandidates(
        uint256 electionId
    ) external view electionExists(electionId) returns (Candidate[] memory) {
        return electionCandidates[electionId];
    }

    function getResults(
        uint256 electionId
    ) external view electionExists(electionId) returns (Candidate[] memory) {
        require(elections[electionId].resultsPublished, "Results not published");
        return electionCandidates[electionId];
    }

    function getRegisteredVoterDetails(
        uint256 electionId,
        address voter
    )
        external
        view
        electionExists(electionId)
        returns (bool isRegistered, uint256 constituencyId, bool hasVoted)
    {
        VoterRegistration memory registration = electionVoters[electionId][voter];
        return (
            registration.isRegistered,
            registration.constituencyId,
            registration.hasVoted
        );
    }

    function _sameString(
        string memory left,
        string memory right
    ) internal pure returns (bool) {
        return keccak256(bytes(left)) == keccak256(bytes(right));
    }
}
