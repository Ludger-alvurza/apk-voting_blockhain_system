// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {

    // Struktur data untuk kandidat
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    address public owner;  // Pemilik kontrak
    mapping(address => bool) public isVerifiedWallet;
    mapping(address => bool) public hasVoted;  // Tracking apakah alamat udah vote atau belum
    mapping(uint => Candidate) public candidates;  // Menyimpan kandidat berdasarkan ID
    uint public candidatesCount;  // Jumlah kandidat
    uint public totalVotes;  // Total suara
    address[] private verifiedWallets;

    // Event untuk memberi tahu kalo ada voting baru
    event Voted(address indexed voter, uint indexed candidateId);
    event WalletVerified(address indexed wallet);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    // Fungsi untuk menambah wallet ke daftar verifikasi
    function verifyWallet(address _wallet) public onlyOwner {
        require(!isVerifiedWallet[_wallet], "Wallet is already verified.");
        isVerifiedWallet[_wallet] = true;
        verifiedWallets.push(_wallet);
        emit WalletVerified(_wallet);
    }

    // Fungsi untuk mengambil semua wallet yang terverifikasi
    function getAllVerifiedWallets() public view returns (address[] memory) {
        return verifiedWallets;
    }

    // Fungsi untuk nambahin kandidat baru
    function registerCandidate(string memory _name) public {
        require(msg.sender == owner, "Only the owner can add candidates.");
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    // Fungsi untuk vote
    function vote(uint _candidateId) public {
        // Cek apakah wallet terverifikasi
        require(isVerifiedWallet[msg.sender], "Your wallet is not verified. Please contact the admin.");
        
        // Cek apakah sudah pernah vote sebelumnya
        require(!hasVoted[msg.sender], "Error: You have already voted. Each address can vote only once.");
        
        // Cek apakah kandidat valid
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Error: Invalid candidate ID. Please choose a valid candidate.");

        // Tandai alamat sudah vote
        hasVoted[msg.sender] = true;
        
        // Tambah jumlah suara untuk kandidat yang dipilih
        candidates[_candidateId].voteCount++;
        
        // Update total suara
        totalVotes++;

        // Emit event bahwa ada yang sudah vote
        emit Voted(msg.sender, _candidateId);
    }

    // Fungsi untuk mengecek apakah wallet terverifikasi
    function checkWalletVerified(address _wallet) public view returns (bool) {
        return isVerifiedWallet[_wallet];
    }

    // Fungsi buat ngambil jumlah suara kandidat
    function getCandidateVotes(uint _candidateId) public view returns (uint) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Error: Invalid candidate ID. Please choose a valid candidate.");
        return candidates[_candidateId].voteCount;
    }

    // Fungsi buat ambil total votes
    function getTotalVotes() public view returns (uint) {
        return totalVotes;
    }

    // Fungsi untuk mendapatkan nama kandidat berdasarkan ID
    function getCandidateName(uint _candidateId) public view returns (string memory) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Error: Invalid candidate ID. Please choose a valid candidate.");
        return candidates[_candidateId].name;
    }

    // Fungsi untuk mengambil semua kandidat
    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](candidatesCount);
        for (uint i = 0; i < candidatesCount; i++) {
            allCandidates[i] = candidates[i + 1]; // Mulai dari index 1 di smart contract
        }
        return allCandidates;
    }
}
