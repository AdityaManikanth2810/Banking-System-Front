import { modPow, randBetween } from 'bigint-crypto-utils';
import { PrivateKey, PublicKey } from '../types/Security';

const L = (x: bigint, n: bigint) => BigInt((x - BigInt(1)) / BigInt(n));

export async function encryptValue(
	value: number,
	publicKey: PublicKey
): Promise<bigint> {
	const newPublicKey = {
		n: BigInt(publicKey.n),
		g: BigInt(publicKey.g),
	};

	const { n, g } = newPublicKey;
	const nSquared = n * n;

	const r = randBetween(n * n, BigInt(1));

	const c1 = modPow(g, BigInt(value), nSquared);
	const c2 = modPow(r, n, nSquared);

	return (c1 * c2) % nSquared;
}

export async function decryptValue(
	cipher: string,
	publicKey: PublicKey,
	privateKey: PrivateKey
): Promise<bigint> {
	const cipherText = BigInt(cipher);

	const newPublicKey = {
		n: BigInt(publicKey.n),
		g: BigInt(publicKey.g),
	};

	const newPrivateKey = {
		lambda: BigInt(privateKey.lambda),
		mu: BigInt(privateKey.mu),
	};

	const { n } = newPublicKey;
	const { lambda, mu } = newPrivateKey;

	const alpha = modPow(cipherText, lambda, n * n);

	return (L(alpha, n) * mu) % n;
}
