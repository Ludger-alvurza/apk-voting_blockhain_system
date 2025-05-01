import { ethers } from "ethers";
import ContractABI from "./ContractABI.json";

export const contractABI: any = ContractABI;
export const contractAddress: string =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

export const connectToContract = async () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Log a success message once the contract is connected
    console.log("Contract connected:", contract);

    return contract;
  } else {
    console.log("Ethereum wallet not found");
    return null;
  }
};
