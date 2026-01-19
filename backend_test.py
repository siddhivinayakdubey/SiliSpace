import requests
import sys
import json
from datetime import datetime, timedelta

class DistanceHugAPITester:
    def __init__(self, base_url="https://distancehug.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_room_code = None
        self.test_partner1 = "TestUser1"
        self.test_partner2 = "TestUser2"

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"Response: {response.text}")
                except:
                    pass

            return success, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_create_room(self):
        """Test room creation"""
        success, response = self.run_test(
            "Create Room",
            "POST",
            "rooms/create",
            200,
            data={"partner_name": self.test_partner1}
        )
        if success and 'code' in response:
            self.test_room_code = response['code']
            print(f"Room created with code: {self.test_room_code}")
            return True
        return False

    def test_get_room(self):
        """Test getting room details"""
        if not self.test_room_code:
            print("❌ No room code available for testing")
            return False
        
        success, response = self.run_test(
            "Get Room",
            "GET",
            f"rooms/{self.test_room_code}",
            200
        )
        return success and response.get('code') == self.test_room_code

    def test_join_room(self):
        """Test joining a room"""
        if not self.test_room_code:
            print("❌ No room code available for testing")
            return False
        
        success, response = self.run_test(
            "Join Room",
            "POST",
            "rooms/join",
            200,
            data={"code": self.test_room_code, "partner_name": self.test_partner2}
        )
        return success

    def test_send_flower(self):
        """Test sending a flower"""
        if not self.test_room_code:
            print("❌ No room code available for testing")
            return False
        
        success, response = self.run_test(
            "Send Flower",
            "POST",
            "flowers/send",
            200,
            data={
                "room_code": self.test_room_code,
                "sender": self.test_partner1,
                "flower_type": "rose",
                "message": "Test flower message"
            }
        )
        return success

    def test_get_flowers(self):
        """Test getting flowers"""
        if not self.test_room_code:
            print("❌ No room code available for testing")
            return False
        
        success, response = self.run_test(
            "Get Flowers",
            "GET",
            f"flowers/{self.test_room_code}",
            200
        )
        return success

    def test_send_message(self):
        """Test sending a love note"""
        if not self.test_room_code:
            print("❌ No room code available for testing")
            return False
        
        success, response = self.run_test(
            "Send Love Note",
            "POST",
            "messages/send",
            200,
            data={
                "room_code": self.test_room_code,
                "sender": self.test_partner1,
                "content": "Test love note message"
            }
        )
        return success

    def test_get_messages(self):
        """Test getting messages"""
        if not self.test_room_code:
            print("❌ No room code available for testing")
            return False
        
        success, response = self.run_test(
            "Get Messages",
            "GET",
            f"messages/{self.test_room_code}",
            200
        )
        return success

    def test_set_countdown(self):
        """Test setting countdown timer"""
        if not self.test_room_code:
            print("❌ No room code available for testing")
            return False
        
        future_date = (datetime.now() + timedelta(days=30)).isoformat()
        success, response = self.run_test(
            "Set Countdown",
            "POST",
            "countdown/set",
            200,
            data={
                "room_code": self.test_room_code,
                "event_name": "Test Event",
                "target_date": future_date
            }
        )
        return success

    def test_get_countdown(self):
        """Test getting countdown"""
        if not self.test_room_code:
            print("❌ No room code available for testing")
            return False
        
        success, response = self.run_test(
            "Get Countdown",
            "GET",
            f"countdown/{self.test_room_code}",
            200
        )
        return success

    def test_update_bucket_list(self):
        """Test updating bucket list"""
        if not self.test_room_code:
            print("❌ No room code available for testing")
            return False
        
        success, response = self.run_test(
            "Update Bucket List",
            "POST",
            "bucketlist/update",
            200,
            data={
                "room_code": self.test_room_code,
                "items": [
                    {"text": "Test bucket item 1", "completed": False},
                    {"text": "Test bucket item 2", "completed": True}
                ]
            }
        )
        return success

    def test_get_bucket_list(self):
        """Test getting bucket list"""
        if not self.test_room_code:
            print("❌ No room code available for testing")
            return False
        
        success, response = self.run_test(
            "Get Bucket List",
            "GET",
            f"bucketlist/{self.test_room_code}",
            200
        )
        return success

    def test_send_hug(self):
        """Test sending virtual hug"""
        if not self.test_room_code:
            print("❌ No room code available for testing")
            return False
        
        success, response = self.run_test(
            "Send Virtual Hug",
            "POST",
            "hugs/send",
            200,
            data={
                "room_code": self.test_room_code,
                "sender": self.test_partner1,
                "hug_type": "warm"
            }
        )
        return success

    def test_get_hugs(self):
        """Test getting hugs"""
        if not self.test_room_code:
            print("❌ No room code available for testing")
            return False
        
        success, response = self.run_test(
            "Get Virtual Hugs",
            "GET",
            f"hugs/{self.test_room_code}",
            200
        )
        return success

def main():
    print("🚀 Starting Distance Hug API Tests...")
    tester = DistanceHugAPITester()

    # Test sequence
    tests = [
        tester.test_root_endpoint,
        tester.test_create_room,
        tester.test_get_room,
        tester.test_join_room,
        tester.test_send_flower,
        tester.test_get_flowers,
        tester.test_send_message,
        tester.test_get_messages,
        tester.test_set_countdown,
        tester.test_get_countdown,
        tester.test_update_bucket_list,
        tester.test_get_bucket_list,
        tester.test_send_hug,
        tester.test_get_hugs
    ]

    for test in tests:
        if not test():
            print(f"❌ Critical test failed: {test.__name__}")
            break

    # Print results
    print(f"\n📊 Backend API Tests Summary:")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"Success rate: {success_rate:.1f}%")
    
    if tester.test_room_code:
        print(f"Test room code: {tester.test_room_code}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())