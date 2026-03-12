import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Recupero l'URL dal file .env (con fallback di sicurezza)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchCards = createAsyncThunk('cards/fetchCards', async () => {
  // Uniamo l'URL base all'endpoint specifico
  const response = await fetch(`${API_BASE_URL}/cards`);
  
  if (!response.ok) throw new Error('Errore nel caricamento');
  return response.json();
});

const cardsSlice = createSlice({
  name: 'cards',
  initialState: { items: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchCards.rejected, (state) => {
        // Fallback locale se il server non risponde
        state.items = [
          { id: 1, title: "Seoul Mood", desc: "Design pulito e minimalista." },
          { id: 2, title: "Ocean Breeze", desc: "Colori pastello e trasparenze." }
        ];
        state.status = 'failed';
      });
  },
});

export const store = configureStore({
  reducer: {
    cards: cardsSlice.reducer,
  },
});