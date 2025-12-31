import type { Address } from '../types/passport';
import type { LookupResult, BalanceResponse, GasResponse, ProductsResponse, ErrorResponse } from '../types/passport';

/**
 * Cliente para API do SNE Scroll Passport
 * Segue o contract definido em API_CONTRACT.md
 */

// SNE Scroll Passport is frontend-only, no backend API available
const API_BASE =
  (import.meta.env?.VITE_PASSPORT_API_URL as string | undefined) ?? null;

/**
 * Retry strategy: 3 tentativas com exponential backoff
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries = 3
): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);

      // Não retryar em erros client-side
      if (response.status === 400 || response.status === 401 ||
          response.status === 403 || response.status === 404) {
        return response;
      }

      // Retryar em erros server-side e rate limits
      if (response.ok || (response.status >= 500 && response.status < 600)) {
        return response;
      }

      // Rate limit - respeitar Retry-After
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10);
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          continue;
        }
      }

      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Max retries exceeded');
}

/**
 * Busca dados de um endereço (licenças, keys, boxes)
 * NOT AVAILABLE: SNE Scroll Passport não tem API backend
 */
export async function lookupAddress(address: string): Promise<LookupResult> {
  throw new Error(
    'Validador de Licenças temporariamente indisponível. ' +
    'A API do SNE Scroll Passport não está acessível no momento. ' +
    'Use o aplicativo original em: https://sne-scroll-pass.vercel.app'
  );
}

/**
 * Verifica acesso de uma licença específica
 * MOCK IMPLEMENTATION: Simula verificação de licença
 */
export async function checkLicense(nodeId: string): Promise<{ access: boolean; status: string }> {
  throw new Error(
    'Verificação de licença temporariamente indisponível. ' +
    'A API do SNE Scroll Passport não está acessível no momento.'
  );
}

/**
 * Busca balance de um endereço
 * NOT AVAILABLE: SNE Scroll Passport não tem API backend
 */
export async function getBalance(address: Address): Promise<BalanceResponse> {
  throw new Error(
    'Consulta de saldo temporariamente indisponível. ' +
    'A API do SNE Scroll Passport não está acessível no momento.'
  );
}

/**
 * Busca preço atual de gas
 * NOT AVAILABLE: SNE Scroll Passport não tem API backend
 */
export async function getGasPrice(): Promise<GasResponse> {
  throw new Error(
    'Gas tracker temporariamente indisponível. ' +
    'A API do SNE Scroll Passport não está acessível no momento.'
  );
}

/**
 * Busca produtos disponíveis
 * NOT AVAILABLE: SNE Scroll Passport não tem API backend
 */
export async function getProducts(): Promise<ProductsResponse> {
  throw new Error(
    'Catálogo de produtos temporariamente indisponível. ' +
    'A API do SNE Scroll Passport não está acessível no momento.'
  );
}
