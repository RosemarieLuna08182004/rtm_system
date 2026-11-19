import { APP_USER_TERMS } from "@/constants";
import { userTermsInitial } from "@/shared";
import { createSlice} from "@reduxjs/toolkit";

const userTermsSlice = createSlice({
	name: APP_USER_TERMS,
	initialState: userTermsInitial,
	reducers: {
	},
});

export default userTermsSlice.reducer;