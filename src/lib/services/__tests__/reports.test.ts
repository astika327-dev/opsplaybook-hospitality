// __tests__/reports.test.ts

import { createReport, getReports, approveOrRejectReport } from "../reports";
import { db } from "@/lib/db";

// Mock the db module using Jest
jest.mock("@/lib/db", () => ({
  db: {
    transaction: jest.fn(),
    query: {
      reports: {
        findMany: jest.fn(),
      },
    },
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
  },
}));

// A mock transaction object for testing transactional logic
const mockTx = {
  insert: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  returning: jest.fn(),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
};

// Configure the mock for db.transaction to execute the callback with mockTx
(db.transaction as jest.Mock).mockImplementation(async (callback) => callback(mockTx));


describe("Reports Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test case for createReport
  it("should create a report and its details within a transaction", async () => {
    const reportData = {
      department: "housekeeping",
      shiftType: "morning",
      checklists: [{ item: "Clean lobby", status: "completed" }],
      issues: [{ description: "Leaky faucet" }],
      photos: [{ url: "http://example.com/photo.jpg" }],
    };
    const userId = 1;

    (mockTx.returning as jest.Mock).mockResolvedValueOnce([{ id: 1 }]);

    await createReport(reportData as any, userId);

    expect(db.transaction).toHaveBeenCalled();
    expect(mockTx.insert).toHaveBeenCalledTimes(4); // reports, checklists, issues, photos
    expect(mockTx.returning).toHaveBeenCalled();
  });

  // Test case for getReports based on user role
  it("should fetch reports for a staff member", async () => {
    const mockSession = {
      user: { id: "1", role: "staff", department: "housekeeping" },
    };

    (db.query.reports.findMany as jest.Mock).mockResolvedValueOnce([
      { id: 1, userId: 1 },
    ]);

    const reports = await getReports(mockSession as any);

    expect(db.query.reports.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.any(Object),
      })
    );
    expect(reports).toHaveLength(1);
  });

  // Test case for approveOrRejectReport
  it("should approve a report and create an approval record", async () => {
    const reportId = 1;
    const approvalData = { status: "approved", comments: "Good job" };
    const approverId = 2;

    (mockTx.returning as jest.Mock).mockResolvedValueOnce([{ id: reportId, status: "approved" }]);

    const updatedReport = await approveOrRejectReport(reportId, approvalData as any, approverId);

    expect(db.transaction).toHaveBeenCalled();
    expect(mockTx.update).toHaveBeenCalled();
    expect(mockTx.insert).toHaveBeenCalled();
    expect(updatedReport.status).toBe("approved");
  });
});
