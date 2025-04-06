import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useToken } from '../../TokenContext'; // adjust path if needed

interface Account {
  accountId: string;
  referenceName: string;
  accountNumber: string;
  accountName: string;
  productName: string;
  kycCompliant: boolean;
  balance?: any | null;
  isFetchingBalance?: boolean;
  [key: string]: any;
}

interface BalanceData {
  accountId: string;
  currentBalance: number;
  availableBalance: number;
  budgetBalance: number;
  straightBalance: number;
  cashBalance: number;
  currency: string;
  [key: string]: any;
}

const AccountCards: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useToken();
  const [balanceError, setBalanceError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      setError(null);

      if (!token) {
        setError('Authentication token is missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://investec-developer-project-repo.visitmyjoburg.co.za/api/fetch-account-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: token,
          }),
        });

        const contentType = response.headers.get('Content-Type');
        let data;

        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
          console.log('Full Account Info API Response:', JSON.stringify(data, null, 2)); // Log the full response
        } else {
          const text = await response.text();
          setError(`Non-JSON response for accounts:\n\n${text}`);
          console.log('Full Account Info API Response (Non-JSON):', text); // Log non-JSON response
          setLoading(false);
          return;
        }

        if (response.ok && data.success && data.accountData && data.accountData.data && Array.isArray(data.accountData.data.accounts)) {
          const formattedAccounts = data.accountData.data.accounts.map((item) => ({
            accountId: item.accountId || 'N/A',
            referenceName: item.referenceName || 'N/A',
            accountNumber: item.accountNumber || 'N/A',
            accountName: item.accountName || 'N/A',
            productName: item.productName || 'N/A',
            kycCompliant: item.kycCompliant !== undefined ? Boolean(item.kycCompliant) : false,
            balance: null,
            isFetchingBalance: false,
            ...item,
          }));
          setAccounts(formattedAccounts);
        } else {
          setError(`Failed to fetch accounts: Invalid data structure\n${JSON.stringify(data, null, 2)}`);
        }
      } catch (err: any) {
        setError(`Error fetching accounts:\n${err.message || 'Something went wrong'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [token]);

  const fetchBalance = async (accountId: string, index: number) => {
    if (!token) {
      console.error('No token available to fetch balance.');
      setBalanceError('Authentication token is missing.');
      return;
    }

    const updatedAccounts = accounts.map((acc, i) =>
      i === index ? { ...acc, isFetchingBalance: true, balance: null } : acc
    );
    setAccounts(updatedAccounts);
    setBalanceError(null);

    try {
      const response = await fetch(
        'https://investec-developer-project-repo.visitmyjoburg.co.za/api/fetch-account-balance',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accountId: accountId,
            access_token: token
          })
        }
      );

      const contentType = response.headers.get('Content-Type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log(`Full Balance API Response for ${accountId}:`, JSON.stringify(data, null, 2));
      } else {
        const text = await response.text();
        setBalanceError(`Non-JSON response for balance:\n\n${text}`);
        console.log(`Full Balance API Response (Non-JSON) for ${accountId}:`, text);
        const revertAccounts = accounts.map((acc, i) =>
          i === index ? { ...acc, isFetchingBalance: false } : acc
        );
        setAccounts(revertAccounts);
        return;
      }

      if (response.ok && data.success && data.balance && data.balance.data) {
        const balanceData: BalanceData = data.balance.data;
        const updatedAccountsWithBalance = accounts.map((acc, i) =>
          i === index ? { ...acc, balance: balanceData, isFetchingBalance: false } : acc
        );
        setAccounts(updatedAccountsWithBalance);
      } else {
        setBalanceError(`Failed to fetch balance for ${accountId}:\n${data.error || JSON.stringify(data, null, 2)}`);
        const revertAccounts = accounts.map((acc, i) =>
          i === index ? { ...acc, isFetchingBalance: false } : acc
        );
        setAccounts(revertAccounts);
      }
    } catch (err: any) {
      setBalanceError(`Error fetching balance for ${accountId}:\n${err.message || 'Something went wrong'}`);
      const revertAccounts = accounts.map((acc, i) =>
        i === index ? { ...acc, isFetchingBalance: false } : acc
      );
      setAccounts(revertAccounts);
    }
  };

  const renderBalance = (balance: BalanceData) => {
    if (balance && typeof balance === 'object') {
      return Object.entries(balance).map(([key, value]) => (
        <View key={key} style={accountCardStyles.balanceItemCard}>
          <Text style={accountCardStyles.balanceItemLabel}>{key}:</Text>
          <Text style={accountCardStyles.balanceItemValue}>{String(value)}</Text>
        </View>
      ));
    }
    return <Text style={accountCardStyles.value}>{JSON.stringify(balance)}</Text>;
  };

  const renderValue = (value: any) => {
    if (typeof value === 'object' && value !== null) {
      return Object.entries(value).map(([key, val]) => (
        <Text key={key} style={accountCardStyles.nestedValue}>
          <Text style={accountCardStyles.nestedLabel}>{key}: </Text>
          {renderValue(val)}
        </Text>
      ));
    }
    return String(value);
  };

  if (loading) {
    return (
      <View style={accountCardStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={accountCardStyles.loadingText}>Fetching Account Information...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={accountCardStyles.errorContainer}>
        <Text style={accountCardStyles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={accountCardStyles.container}>
      <Text style={accountCardStyles.title}>Account Information</Text>

      {accounts.length > 0 ? (
        <ScrollView>
          <View style={accountCardStyles.grid}>
            {accounts.map((account, index) => (
              <View key={account.accountId} style={accountCardStyles.card}>
                <Text style={accountCardStyles.referenceName}>{account.referenceName}</Text>
                <Text style={accountCardStyles.accountId}>ID: {account.accountId}</Text>

                <View style={accountCardStyles.details}>
                  <Text style={accountCardStyles.label}>Account Number:</Text>
                  <Text style={accountCardStyles.value}>{account.accountNumber}</Text>

                  <Text style={accountCardStyles.label}>Account Holder:</Text>
                  <Text style={accountCardStyles.value}>{account.accountName}</Text>

                  <Text style={accountCardStyles.label}>Product Name:</Text>
                  <Text style={accountCardStyles.value}>{account.productName}</Text>

                  <Text style={accountCardStyles.label}>KYC Compliant:</Text>
                  <Text style={accountCardStyles.value}>{account.kycCompliant ? "Yes" : "No"}</Text>

                  {account.balance !== undefined && account.balance !== null && typeof account.balance === 'object' && (
                    <View>
                      <Text style={accountCardStyles.label}>Balance:</Text>
                      <View style={accountCardStyles.balanceContainer}>
                        {renderBalance(account.balance)}
                      </View>
                    </View>
                  )}

                  {Object.keys(account)
                    .filter(
                      (key) =>
                        !['accountId', 'referenceName', 'accountNumber', 'accountName', 'productName', 'kycCompliant', 'balance', 'isFetchingBalance'].includes(key)
                    )
                    .map((key) => (
                      <View key={key}>
                        <Text style={accountCardStyles.label}>{key}:</Text>
                        <Text style={accountCardStyles.value}>{renderValue(account[key])}</Text>
                      </View>
                    ))}
                </View>

                <TouchableOpacity
                  onPress={() => fetchBalance(account.accountId, index)}
                  style={accountCardStyles.button}
                  disabled={account.isFetchingBalance}
                >
                  {account.isFetchingBalance ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={accountCardStyles.buttonText}>Fetch Balance</Text>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={accountCardStyles.alert}>
          <Text style={accountCardStyles.alertText}>No account information found.</Text>
        </View>
      )}

      {balanceError && (
        <View style={accountCardStyles.errorAlert}>
          <Text style={accountCardStyles.errorAlertText}>{balanceError}</Text>
        </View>
      )}
    </View>
  );
};

const accountCardStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#333",
  },
  grid: {
    flexDirection: "column",
    gap: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  referenceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  accountId: {
    color: "#555",
    marginBottom: 12,
  },
  details: {
    marginBottom: 12,
  },
  label: {
    fontWeight: "bold",
    color: "#444",
  },
  value: {
    color: "#666",
    marginBottom: 6,
  },
  nestedValue: {
    color: "#777",
    marginLeft: 10,
    marginBottom: 2,
  },
  nestedLabel: {
    fontWeight: "bold",
    color: "#555",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  alert: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  alertText: {
    color: "#555",
  },
  errorAlert: {
    backgroundColor: "#fee2e2",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  errorAlertText: {
    color: "#b91c1c",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#b91c1c',
    textAlign: 'center',
  },
  balanceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  balanceItemCard: {
    backgroundColor: '#fff', // Use the card background color
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd', // A light border for separation
    minWidth: '45%', // Adjust as needed for layout
    marginBottom: 8,
  },
  balanceItemLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#444', // Use a darker text color for labels
  },
  balanceItemValue: {
    fontSize: 14,
    color: '#666', // Use a slightly lighter text color for values
  },
});

const TokenScreenStyles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  token: {
    fontSize: 14,
    backgroundColor: '#e0e7ff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 14,
    fontFamily: 'monospace',
  },
});

const TokenScreen = () => {
  const { token } = useToken();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ScrollView style={TokenScreenStyles.container}>
      <Text style={TokenScreenStyles.title}>Token Viewer</Text>
      <Text style={TokenScreenStyles.label}>Access Token:</Text>
      <Text style={TokenScreenStyles.token}>{token || 'No token available'}</Text>

      <AccountCards />
    </ScrollView>
  );
};

export default TokenScreen;