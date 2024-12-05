const admin = require("firebase-admin");

const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function getWallets() {
  const snapshot = await db.collection("wallets").get();
  const wallets = [];
  snapshot.forEach((doc) => wallets.push({ id: doc.id, ...doc.data() }));
  return wallets;
}

async function getMyWallet(publicKey) {
  const doc = await db.collection("wallets").doc(publicKey).get();
  if (!doc.exists) {
    const initialData = { tokenA: 500, tokenB: 500 };
    await db.collection("wallets").doc(publicKey).set(initialData);
    return initialData;
  }
  return doc.data();
}

async function getPools() {
  const snapshot = await db.collection("pools").get();
  const pools = [];
  snapshot.forEach((doc) => pools.push({ id: doc.id, ...doc.data() }));
  return pools;
}

async function getPool(id) {
  const doc = await db.collection("pools").doc(id).get();
  if (!doc.exists) {
    throw new Error("Pool bulunamadı!");
  }
  return doc.data();
}

/**
 * Swap ve AddLiquidity işlemleri doğrudan havuz ve kullanıcı verilerini günceller.
 */

async function updatePool(poolId, data) {
  await db.collection("pools").doc(poolId).set(data, { merge: true });
}

async function updateWallet(publicKey, data) {
  await db.collection("wallets").doc(publicKey).set(data, { merge: false });
}

async function swap(privateKey, poolId, tokenType, amount) {


  const walletData = await getMyWallet(privateKey);
  const poolData = await getPool(poolId);

  if (tokenType === "A") {
    if (walletData.tokenA < amount) {
      throw new Error("Yetersiz TokenA bakiyesi!");
    }
    const x = poolData.tokenA;
    const y = poolData.tokenB;
    const K = poolData.K;

    const newX = x + amount;
    const newY = K / newX;
    const outTokenB = y - newY;

    if (outTokenB <= 0) {
      throw new Error("Havuz bu miktarda swap için uygun değil!");
    }

    poolData.tokenA = newX;
    poolData.tokenB = newY;
    walletData.tokenA -= amount;
    walletData.tokenB += outTokenB;

    await updatePool(poolId, poolData);
    await updateWallet(privateKey, walletData);
    return { swappedOut: outTokenB, pool: poolData, wallet: walletData };
  } else if (tokenType === "B") {
    if (walletData.tokenB < amount) {
      throw new Error("Yetersiz TokenB bakiyesi!");
    }

    const x = poolData.tokenB;
    const y = poolData.tokenA;
    const K = poolData.K;

    const newX = x + amount;
    const newY = K / newX;
    const outTokenA = y - newY;

    if (outTokenA <= 0) {
      throw new Error("Havuz bu miktarda swap için uygun değil!");
    }

    poolData.tokenB = newX;
    poolData.tokenA = newY;
    walletData.tokenB -= amount;
    walletData.tokenA += outTokenA;

    await updatePool(poolId, poolData);
    await updateWallet(privateKey, walletData);
    return { swappedOut: outTokenA, pool: poolData, wallet: walletData };
  } else {
    throw new Error("Geçersiz token seçimi.");
  }
}

async function addLiquidity(privateKey, poolId, amountA, amountB) {
  const walletData = await getMyWallet(privateKey);
  const poolData = await getPool(poolId);

  if (walletData.tokenA < amountA || walletData.tokenB < amountB) {
    throw new Error("Yetersiz bakiye!");
  }

  poolData.tokenA += amountA;
  poolData.tokenB += amountB;
  poolData.K = poolData.tokenA * poolData.tokenB;

  walletData.tokenA -= amountA;
  walletData.tokenB -= amountB;

  await updatePool(poolId, poolData);
  await updateWallet(privateKey, walletData);

  return { pool: poolData, wallet: walletData };
}

module.exports = {
  getWallets,
  getMyWallet,
  getPools,
  getPool,
  swap,
  addLiquidity,
};
