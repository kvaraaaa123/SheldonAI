import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { parentIncome, parentAssets, studentIncome, studentAssets, householdSize, numberInCollege } = await req.json();

  // Simplified SAI calculation based on federal methodology
  const PI = parseFloat(parentIncome) || 0;
  const PA = parseFloat(parentAssets) || 0;
  const SI = parseFloat(studentIncome) || 0;
  const SA = parseFloat(studentAssets) || 0;
  const HS = parseInt(householdSize) || 3;
  const NC = parseInt(numberInCollege) || 1;

  // Income protection allowance (approximate, varies by household size)
  const ipaTable: Record<number, number> = { 1: 11820, 2: 15940, 3: 19740, 4: 24360, 5: 28680, 6: 33540 };
  const ipa = ipaTable[Math.min(HS, 6)] ?? (33540 + (HS - 6) * 4540);

  // Parent available income
  const parentAvailableIncome = Math.max(0, PI - ipa - (PI * 0.22)); // approximate taxes

  // Parent asset contribution (5.64% of assets above asset protection)
  const assetProtection = Math.max(0, 5900 + (HS > 2 ? (HS - 2) * 1500 : 0));
  const parentAssetContribution = Math.max(0, (PA - assetProtection) * 0.0564);

  // Student income contribution (50% above $7600 protection)
  const studentIncomeContribution = Math.max(0, (SI - 7600) * 0.5);

  // Student asset contribution (20%)
  const studentAssetContribution = SA * 0.20;

  // Total adjusted available income
  const totalAAI = parentAvailableIncome + parentAssetContribution + studentIncomeContribution + studentAssetContribution;

  // AAI to SAI conversion (approximate federal table)
  let sai = 0;
  if (totalAAI <= 0) sai = -1500;
  else if (totalAAI <= 15000) sai = Math.round(totalAAI * 0.22);
  else if (totalAAI <= 26000) sai = Math.round(3300 + (totalAAI - 15000) * 0.25);
  else if (totalAAI <= 34000) sai = Math.round(6050 + (totalAAI - 26000) * 0.29);
  else if (totalAAI <= 44000) sai = Math.round(8370 + (totalAAI - 34000) * 0.34);
  else sai = Math.round(11770 + (totalAAI - 44000) * 0.47);

  // Adjust for multiple in college
  if (NC > 1) sai = Math.round(sai / NC);

  return Response.json({ sai, totalAAI: Math.round(totalAAI) });
}
