const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const target = `  const globalMutate = async (args?: any) => {
    // just re-fetch
    const data = await fetchAllData();`;

const replacement = `  const globalMutate = async (args?: any) => {
    if ((window as any).isMutating) return;
    (window as any).isMutating = true;
    try {
      // Add a slight delay to allow batching
      await new Promise(r => setTimeout(r, 500));
      const data = await fetchAllData();
      const { usersData, txData, invData, prodData, commData, incData, sysData, settingsData, chatData } = data;
      if (usersData) {
        const mappedUsers = usersData.map(u => ({ ...u, disabled: u.disabled || u.role === 'disabled' }));
        setUsers(mappedUsers);
        setCurrentUser(prevUser => {
          if (!prevUser) return null;
          const updated = mappedUsers.find(u => u.id === prevUser.id);
          return updated || prevUser;
        });
      }
      if (txData) setTransactions(txData);
      if (invData) setInvestments(invData);
      if (prodData) setProducts(prodData);
      if (commData) setCommissions(commData);
      if (incData) setIncomeRecords(incData);
      if (sysData) setSystemDepositAccounts(sysData);
      if (chatData) {
        setChatMessages(chatData);
        localStorage.setItem("chatMessages", JSON.stringify(chatData));
      }
      if (settingsData) {
        setGlobalWithdrawalLimit(settingsData.globalWithdrawalLimit ?? 5000000);
        setManagerLink(settingsData.managerLink || "https://t.me/manager");
        setGroupLink(settingsData.groupLink || "https://t.me/group");
        _setAnnouncement(settingsData.announcement || null);
        _setAdminUsdtAddress(settingsData.adminUsdtAddress || null);
        _setPromoImage(settingsData.promoImage || null);
        _setProductPromoCountdown(settingsData.productPromoCountdown || null);
        _setAboutUsImage(settingsData.aboutUsImage || "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Equinor_logo.svg/1024px-Equinor_logo.svg.png");
        _setCarouselImages(settingsData.carouselImages || [
           "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
           "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800"
        ]);
      }
    } finally {
      (window as any).isMutating = false;
    }
  };`;

// replace up to chatData line
code = code.replace(/  const globalMutate = async \(args\?: any\) => \{\n\s*\/\/ just re-fetch\n\s*const data = await fetchAllData\(\);\n\s*const \{ usersData, txData, invData, prodData, commData, incData, sysData, settingsData, chatData \} = data;/, '/* GLOBAL_MUTATE_REPLACEMENT */');

const finalCode = code.replace('/* GLOBAL_MUTATE_REPLACEMENT */', replacement.replace(/  const globalMutate = async \(args\?: any\) => \{\n\s*if \(\(window as any\).isMutating\) return;\n/, `  const globalMutate = async (args?: any) => {
    if ((window as any).isMutating) {
      if ((window as any).mutateQueue) clearTimeout((window as any).mutateQueue);
      (window as any).mutateQueue = setTimeout(() => globalMutate(args), 600);
      return;
    }
`));

fs.writeFileSync('src/store.tsx', finalCode);
