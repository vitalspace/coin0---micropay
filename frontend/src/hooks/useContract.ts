import { contractService } from "@services/contract.services";

export const useContract = () => {
  const createCampaign = contractService.createCampaign.bind(contractService);
  const initializeContract = contractService.initializeContract.bind(contractService);
  const getCampaignsByCreator = contractService.getCampaignsByCreator.bind(contractService);
  const getActiveCampaigns = contractService.getActiveCampaigns.bind(contractService);
  const getCampaign = contractService.getCampaign.bind(contractService);
  const getTotalCampaigns = contractService.getTotalCampaigns.bind(contractService);
  const campaignExists = contractService.campaignExists.bind(contractService);
  const storeExists = contractService.storeExists.bind(contractService);
  const getCampaignBalance = contractService.getCampaignBalance.bind(contractService);
  const getDonationHistory = contractService.getDonationHistory.bind(contractService);
  const getPurchaseHistory = contractService.getPurchaseHistory.bind(contractService);
  const donateToCampaign = contractService.donateToCampaign.bind(contractService);
  const purchaseProduct = contractService.purchaseProduct.bind(contractService);
  const purchaseBusinessService = contractService.purchaseBusinessService.bind(contractService);
  const withdrawFunds = contractService.withdrawFunds.bind(contractService);
  const withdrawAllFunds = contractService.withdrawAllFunds.bind(contractService);
  const getCampaignProgress = contractService.getCampaignProgress.bind(contractService);
  const getAllCampaigns = contractService.getAllCampaigns.bind(contractService);
  const getTotalBalance = contractService.getTotalBalance.bind(contractService);
  const getAllSupporters = contractService.getAllSupporters.bind(contractService);
  return {
    createCampaign,
    initializeContract,
    getCampaignsByCreator,
    getActiveCampaigns,
    getCampaign,
    getTotalCampaigns,
    campaignExists,
    storeExists,
    getCampaignBalance,
    getDonationHistory,
    getPurchaseHistory,
    donateToCampaign,
    purchaseProduct,
    purchaseBusinessService,
    withdrawFunds,
    withdrawAllFunds,
    getCampaignProgress,
    getAllCampaigns,
    getTotalBalance,
    getAllSupporters,
  };
};
