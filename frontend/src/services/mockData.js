export const mockParkingData = [
    {
        id: 1,
        rowName: "Row A",
        rowNumber: 1,
        parkingSlots: [
            {
                id: 1,
                slotNumber: "A1",
                status: "AVAILABLE",
                reservedByUser: null
            },
            {
                id: 2,
                slotNumber: "A2",
                status: "OCCUPIED",
                reservedByUser: "user123"
            },
            {
                id: 3,
                slotNumber: "A3",
                status: "RESERVED",
                reservedByUser: "user456"
            }
        ]
    },
    {
        id: 2,
        rowName: "Row B",
        rowNumber: 2,
        parkingSlots: [
            {
                id: 4,
                slotNumber: "B1",
                status: "AVAILABLE",
                reservedByUser: null
            },
            {
                id: 5,
                slotNumber: "B2",
                status: "OCCUPIED",
                reservedByUser: "user789"
            }
        ]
    },
    {
        id: 3,
        rowName: "Row C",
        rowNumber: 3,
        parkingSlots: [
            {
                id: 6,
                slotNumber: "C1",
                status: "AVAILABLE",
                reservedByUser: null
            }
        ]
    }
];