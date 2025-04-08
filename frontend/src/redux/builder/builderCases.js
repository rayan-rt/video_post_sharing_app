function handleAsyncCases(builder, thunk, req) {
  builder.addCase(thunk.pending, (state) => {
    state.isLoading = true;
  });
  builder.addCase(thunk.rejected, (state, action) => {
    state.isLoading = false;
    state.isError = action.payload;
    state.data = null;
  });
  builder.addCase(thunk.fulfilled, (state, action) => {
    state.isLoading = false;
    state.isError = null;
    state.data = action.payload;
    // if (req === "signin" || req === "signup") state.isAuthenticated = true;
    // else if (req === "signout") state.isAuthenticated = false;
    if (req === "signout") state.isAuthenticated = false;
    else state.isAuthenticated = true;
  });
}

export { handleAsyncCases };
