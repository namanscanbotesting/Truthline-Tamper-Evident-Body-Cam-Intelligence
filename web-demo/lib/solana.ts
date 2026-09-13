import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";

export const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

export function getSolanaConnection(): Connection {
  const rpc = process.env.SOLANA_RPC_URL;
  if (!rpc) throw new Error("Missing SOLANA_RPC_URL");
  return new Connection(rpc, "confirmed");
}

export function getServerKeypair(): Keypair {
  const raw = process.env.SOLANA_KEYPAIR_JSON;
  if (!raw) throw new Error("Missing SOLANA_KEYPAIR_JSON");

  let arr: number[];
  try {
    arr = JSON.parse(raw);
  } catch {
    throw new Error("SOLANA_KEYPAIR_JSON must be valid JSON (e.g. [1,2,3,...])");
  }

  const keypair = Keypair.fromSecretKey(Uint8Array.from(arr));
  console.log("Solana public key:", keypair.publicKey.toBase58());
  return keypair;
}

export async function assertSolanaReady() {
  const connection = getSolanaConnection();
  const keypair = getServerKeypair();
  const balance = await connection.getBalance(keypair.publicKey);
  console.log(`Solana balance (lamports): ${balance}`);
  if (balance === 0) {
    throw new Error("Solana balance is 0; fund the keypair before publishing.");
  }
  return { connection, keypair, balance };
}

export async function anchorMemo(
  memo: string,
  options?: { connection?: Connection; keypair?: Keypair }
): Promise<string> {
  const connection = options?.connection ?? getSolanaConnection();
  const keypair = options?.keypair ?? getServerKeypair();

  const instruction = new TransactionInstruction({
    keys: [],
    programId: MEMO_PROGRAM_ID,
    data: Buffer.from(memo, "utf8"),
  });

  const transaction = new Transaction().add(instruction);
  return sendAndConfirmTransaction(connection, transaction, [keypair]);
}

export async function fetchMemoForTransaction(
  signature: string
): Promise<string | null> {
  const connection = getSolanaConnection();
  const tx = await connection.getParsedTransaction(signature, {
    maxSupportedTransactionVersion: 0,
  });

  console.log("fetchMemoForTransaction: tx", tx ?? "null");
  if (!tx) return null;

  const logMemo = tx.meta?.logMessages?.find((line) =>
    line.includes("Program log: Memo")
  );
  if (logMemo) {
    const match = logMemo.match(/Memo \(len \d+\): "(.+)"$/);
    if (match?.[1]) {
      try {
        return JSON.parse(`"${match[1]}"`);
      } catch {
        // Fall through to instruction parsing.
      }
    }
  }

  for (const instruction of tx.transaction.message.instructions) {
    if ("parsed" in instruction && instruction.program === "spl-memo") {
      const parsed = instruction.parsed as {
        type?: string;
        info?: { memo?: string };
      };
      if (parsed?.type === "memo" && parsed?.info?.memo) {
        return parsed.info.memo;
      }
    }
  }

  const fallback = await connection.getTransaction(signature, {
    maxSupportedTransactionVersion: 0,
  });

  if (!fallback) return null;

  const memoProgramId = MEMO_PROGRAM_ID.toBase58();
  const message = fallback.transaction.message as unknown as {
    instructions?: Array<{
      programId?: PublicKey | string;
      data?: string;
    }>;
    compiledInstructions?: Array<{
      programIdIndex: number;
      data: string;
    }>;
    staticAccountKeys?: PublicKey[];
    getAccountKeys?: () => { staticAccountKeys: PublicKey[] };
  };

  if (Array.isArray(message.instructions)) {
    for (const instruction of message.instructions) {
      const programId =
        typeof instruction.programId === "string"
          ? instruction.programId
          : instruction.programId?.toBase58();
      const data = instruction.data;

      if (programId === memoProgramId && typeof data === "string") {
        try {
          const decoded = bs58.decode(data);
          return Buffer.from(decoded).toString("utf8");
        } catch {
          return null;
        }
      }
    }
  }

  if (Array.isArray(message.compiledInstructions)) {
    const keys =
      message.getAccountKeys?.().staticAccountKeys ?? message.staticAccountKeys;
    if (keys) {
      for (const instruction of message.compiledInstructions) {
        const programId = keys[instruction.programIdIndex]?.toBase58();
        if (programId === memoProgramId && instruction.data) {
          try {
            const decoded = bs58.decode(instruction.data);
            return Buffer.from(decoded).toString("utf8");
          } catch {
            return null;
          }
        }
      }
    }
  }

  return null;
}
