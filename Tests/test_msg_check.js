// File: test_message_handler.js
// Author: Julian Fisher
// Date: 1/21/2023
// Description: Test the message handler message checker by passing it pre generated messages
// and checking the response

const checker = require('../ReputableEntity/websocket-messaging/message_checker')
// Example of a properly formatted SendReceipt message
/*
{
    "Header": {
        "MsgType": "ShareReceipt",
        "TTL": 3,
        "SrcIPorHost": "ws://localhost:8989",
        "MsgID": "A"
    },
    "Body": {
        "Receipt": {
            "source": "c765ca2e-2784-455e-9c79-fdb9c7f8f3f2",
            "target": "bce7b491-1ebc-437d-b674-53cf65369296",
            "claim": {
                "id": "96da9755-14f8-4e10-a123-f407b4481dd6",
                "type": "Creation",
                "category": "Review","content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            }
        },
        "TXID": "12345-6789-1011-1213",
        "SrcPubKey": "MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgH/kOqIcc9x2YFen4+L9dLoq/WFPN8VfxrS+s6XEX/cNnCTCk0dhj8rOu+08VFpw3cbvnwFhZ8cr0ChVY142y96Vxwz/vfgIeCOxwc8ufQ+7pwli0c0b3jwQHvKBHqLDInk9qDz5W8FMFwlcfWpG0uKt1AJx5wMIv3KPicY8Pf+hAgMBAAE="
    }
}
*/

// Example of a properly formatted RequestReceipt message- there are many variations of this that are formatted properly
/*
{
    "Header": {
        "MsgType": "RequestReceipt",
        "TTL": 3,
        "SrcIPorHost": "ws://localhost:8989",
        "MsgID": "A",
    },
    "Body": {
        "RqstNode": "ws://node1.node.com",
        "Criteria": {
            "Src": "MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgH/kOqIcc9x2YFen4+L9dLoq/WFPN8VfxrS+s6XEX/cNnCTCk0dhj8rOu+08VFpw3cbvnwFhZ8cr0ChVY142y96Vxwz/vfgIeCOxwc8ufQ+7pwli0c0b3jwQHvKBHqLDInk9qDz5W8FMFwlcfWpG0uKt1AJx5wMIv3KPicY8Pf+hAgMBAAE=",
            "TimeFrame": {
                "BgnDT": "05-31-2001",
                "EndDT": "04-02-2022",
            }
        }
    }
}
*/

// Example of a properly formatted RequestReceiptResponse
/*
{
    "Header": {
        "MsgType": "RequestReceiptResponse",
        "TTL": 3,
        "SrcIPorHost": "ws://localhost:8989",
        "MsgID": "A",
    },
    "Body": {
        "Results": [
            {
            "source": "c765ca2e-2784-455e-9c79-fdb9c7f8f3f2",
            "target": "bce7b491-1ebc-437d-b674-53cf65369296",
            "claim": {
                "id": "96da9755-14f8-4e10-a123-f407b4481dd6",
                "type": "Creation",
                "category": "Review","content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            },
            {
            "source": "c765ca2e-2784-455e-9c79-fdb9c7f8f3f2",
            "target": "bce7b491-1ebc-437d-b674-53cf65369295",
            "claim": {
                "id": "96da9755-14f8-4e10-a123-f407b4481dd7",
                "type": "Creation",
                "category": "Review","content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            }
        }
        ]
    }
}
*/

function runTest(testNum, description, expectedResult, message) {
    if (checker(message) == expectedResult) {
        result = "PASS";
    }
    else {
        result = "FAIL";
    }

    console.log("Test #" + testNum + " - " + description + ": " + result)
}

runTest(1, "Proper ShareReceipt", true, {"Header": {"MsgType": "ShareReceipt","TTL": 3,"SrcIPorHost": "ws://localhost:8989","MsgID": "A" },"Body": {"Receipt": {"source": "c765ca2e-2784-455e-9c79-fdb9c7f8f3f2","target": "bce7b491-1ebc-437d-b674-53cf65369296","claim": {"id": "96da9755-14f8-4e10-a123-f407b4481dd6","type": "Creation","category": "Review","content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}},"TXID": "12345-6789-1011-1213","SrcPubKey": "MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgH/kOqIcc9x2YFen4+L9dLoq/WFPN8VfxrS+s6XEX/cNnCTCk0dhj8rOu+08VFpw3cbvnwFhZ8cr0ChVY142y96Vxwz/vfgIeCOxwc8ufQ+7pwli0c0b3jwQHvKBHqLDInk9qDz5W8FMFwlcfWpG0uKt1AJx5wMIv3KPicY8Pf+hAgMBAAE="}});
runTest(2, "Proper RequestReceipt", true,{"Header": {"MsgType": "RequestReceipt","TTL": 3,"SrcIPorHost": "ws://localhost:8989","MsgID": "A",},"Body": {"RqstNode": "ws://node1.node.com","Criteria": {"Src": "MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgH/kOqIcc9x2YFen4+L9dLoq/WFPN8VfxrS+s6XEX/cNnCTCk0dhj8rOu+08VFpw3cbvnwFhZ8cr0ChVY142y96Vxwz/vfgIeCOxwc8ufQ+7pwli0c0b3jwQHvKBHqLDInk9qDz5W8FMFwlcfWpG0uKt1AJx5wMIv3KPicY8Pf+hAgMBAAE=","TimeFrame": {"BgnDT": "05-31-2001","EndDT": "04-02-2022",}}}})
runTest(3, "Invalid Message Type", false,{"Header": {"MsgType": "ShareReceiptS","TTL": 3,"SrcIPorHost": "ws://localhost:8989","MsgID": "A" },"Body": {"Receipt": {"source": "c765ca2e-2784-455e-9c79-fdb9c7f8f3f2","target": "bce7b491-1ebc-437d-b674-53cf65369296","claim": {"id": "96da9755-14f8-4e10-a123-f407b4481dd6","type": "Creation","category": "Review","content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}},"TXID": "12345-6789-1011-1213","SrcPubKey": "MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgH/kOqIcc9x2YFen4+L9dLoq/WFPN8VfxrS+s6XEX/cNnCTCk0dhj8rOu+08VFpw3cbvnwFhZ8cr0ChVY142y96Vxwz/vfgIeCOxwc8ufQ+7pwli0c0b3jwQHvKBHqLDInk9qDz5W8FMFwlcfWpG0uKt1AJx5wMIv3KPicY8Pf+hAgMBAAE="}}); 
runTest(4, "ShareReceipt with invalid receipt", false, {"Header": {"MsgType": "ShareReceipt","TTL": 3,"SrcIPorHost": "ws://localhost:8989","MsgID": "A" },"Body": {"Receipt": {"SORCE": "c765ca2e-2784-455e-9c79-fdb9c7f8f3f2","target": "bce7b491-1ebc-437d-b674-53cf65369296","claim": {"id": "96da9755-14f8-4e10-a123-f407b4481dd6","type": "Creation","category": "Review","content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}},"TXID": "12345-6789-1011-1213","SrcPubKey": "MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgH/kOqIcc9x2YFen4+L9dLoq/WFPN8VfxrS+s6XEX/cNnCTCk0dhj8rOu+08VFpw3cbvnwFhZ8cr0ChVY142y96Vxwz/vfgIeCOxwc8ufQ+7pwli0c0b3jwQHvKBHqLDInk9qDz5W8FMFwlcfWpG0uKt1AJx5wMIv3KPicY8Pf+hAgMBAAE="}});