// Test Firebase Admin credentials
const adminCredentials = "ICItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUV2QUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktZd2dnU2lBZ0VBQW9JQkFRRE1ocW9zbTJsL1dReUlcbnVTK3ZBL3FXa3U2RWRrOGhNSFBCUDF4UGNlZHBlbFQ4UW91Nm5BZEhhby9QS3IrL0VRcTdYcGt1dmxsbHJ4cHRcbjBOVVBQNEFRMVE5U0Rxa0tncEZyYjFIRlgyTGplS28vSlErb2lqa1E1QjNLTUl3TGJrcG5jRlpYdjNCLzRabVpcbm5XYXhzRmZTT0pqU2s4SExyci81ejJ0SXN5L016ck9ybmhoZzdHR0FTV2tSUHBJU2gzU05RbTYwWndQMEYvR2lcbi93NWxhRlJkZm00NjlaNDFFUUc4dGRTNVRrekx3WDRGM3RJTmJiVmJUZXVsS29vR1l2M3BqdzBQSjJ3NDk0ZFlcbi91RU8rZjNNRlhsV2l3cUJzUGM4VStCbEptejFzdzZGK0RQNTZyN0h4YVVaSDE5UEhxTDlSUGV6bnRMVTd2akVcbmJiRkpsMFM3QWdNQkFBRUNnZ0VBU3VRR25TWGROLzNsK295QTJ0K2ttdzA3WEhLcjMvWExkUmdiMTVWWVRNVzRcbko5VEFNSGtncXpSb2EwMzJmMktnb09KdlNlLzJjU2J3a1FTV2Q2cGpYUVovUVNkUUc2S2EyQkdmaWh1MjdKOUxcbkM2c285Q2lFNDl2NzBvVDdTdFk4VldzTG1yN2xWVlpJOWJodW1hTCtUV0pmQjBDR2htdzdMS0NZWXJzR1JrSkRcbmdkMzFQYTJsaHBZYzBPZDFEczFDUCt1NDRPZWJPWXBzTGw5TTZDaHB6Szk0SnROdlJCM2ZWYWl5ZlBnZ0ZIZjFcblRwVmdZL3Y5NmVtanFjejBjY1o0ckhveTdqTmpFUDRERXRxOEdIell4S2MzNUU0UThHY1Z1bHZhR1F2QnFDOWZcbjZ0REh1cXhnS1YzYlpqMnVRT2djUyttWFJPbVBaMWdHaGhNRjRXaWJnUUtCZ1FEK1ZUS1BXTWNGT21MYlpQQVZcblVldFJkZGNwTEthOXNBR2xXMUd3TFpmQm9tMk5uZk1ITU1xdGgzVUpCQ0lpUlNPSFhaR2p1cm42ZEFSUURWKzVcbloyMEt5UzlJRko0UHZacThMdlM3cWN2c0p0UDhpNnBDVFp3VjE0bUh6NzVsbC9wdmU3aFJRVkVnRWp0a2hScXNcbnJ3SlEyWlZuWmN1SCt0ZWhDRGdTQldGek93S0JnUUROM2VLYytxY0RzaTFVYjFlNGZwZ2xrejEva1NUckVpWlFcbk1uOGRhc1FXUk1vV2Qya2Q3OWJRVitGZ1VEdVl0bHJkbG5QTWI5L1dUS0Yvc1NkVUlDSG15TTI5UFlGbjFBOFNcbm84YnJFOVArS1N4M1ZKRklmVGczVUFaVTF4OFY3djZnb0tSTHJUQ1UyWHJHbTJ2Q1hBWmxldFpnWDZjdGdZRzNcbnhyQ25jd2xjZ1FLQmdFcHIwYnlpWkxKQjhIVjBadEJHUlU1ejVmN1ZZd0UwaEhiSGJ2TFhsSVdEcXZ6NmtBZTFcbm5ra0N6eHRSUzArdDNZU1p1NmttVlk5VTdZSWpON1IvOENkczBWb05ObWN5dXhsL3Yvczk1ejcxNmFnSGtrMk9cbmVqTGwvQWR5b2FzR3VyQnVpbk8wWWpHNVJBblk3UUpFdjYrNnkzNFRDbWlDM1IvdzBMOXROYVBMQW9HQU41dnpcblJlSXpVVDFGSDJUQU5sY0Q5RXAwdDB2V3hDVHY4b1BoY0duUnRBNDY1SnkyNlY1TEVaWmJpKy9BV1gwUXlJQ0dcbm9UZXJLREVsQXVBd3RubkRqcHE1Y0ovM243dFpvdmhZbUZHUDF6ejZCUFgwRkxlMmdzSjhJMWpFemVEMEtTR2Jcbm45R1ZxTytpU1puY0h2Rkt6UWpFZGQ0QXc3c1M5amlXcVhUYWw0RUNnWUJxd1Y1NFBDKzJ1aitvOGZTOUZIU2JcblE3c0UzZFE3ZXA3WjNsQUZ5NnJkYWZHYUhvOERzYldLYWdmb1RIbU5XdkRlQVZGMWx3b3FacEhGWi9sRU5xTG5cbmlpRkZmdkVFMXlKL1FZWloyZXBwdmpLQzUzQll4NVVJY1lOTTZJM0FsWk5ZQkFFNFpMMzBHTFBhVGdSTUYrY2tcbitweVdDU3hJQ1JXTjg2eHpNWGV4M0E9PVxuLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVxuIg==";

try {
  // Decode from base64
  const decodedCredentials = Buffer.from(adminCredentials, 'base64').toString('utf-8');
  console.log('Decoded length:', decodedCredentials.length);
  console.log('First 100 chars:', decodedCredentials.substring(0, 100));
  
  // Try to parse as JSON
  try {
    const credentials = JSON.parse(decodedCredentials);
    console.log('Successfully parsed JSON');
    console.log('Project ID:', credentials.project_id);
    console.log('Client email:', credentials.client_email);
  } catch (jsonError) {
    console.log('Not valid JSON, content:', decodedCredentials);
  }
} catch (error) {
  console.error('Error decoding:', error);
}
