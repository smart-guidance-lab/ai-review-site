export function calculateReinvestment(netProfit: number) {
    const REINVESTMENT_RATE = 0.30; // 利益の30%を広告へ
    const MAINTENANCE_COST = 0;    // 運用コストは0を維持
    
    const adBudget = netProfit * REINVESTMENT_RATE;
    const netSavings = netProfit - adBudget - MAINTENANCE_COST;

    return {
        nextAdBudget: adBudget,
        retainedProfit: netSavings
    };
}
