const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const target = `    fetch();
    interval = setInterval(fetch, 10000);
    return () => clearInterval(interval);
  }, []);`;

const replacement = `    fetch();
    interval = setInterval(fetch, 30000); // reduced frequency, rely on realtime

    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        // Debounce the fetch slightly to allow batch updates
        if (window.dbFetchTimeout) clearTimeout(window.dbFetchTimeout);
        window.dbFetchTimeout = setTimeout(fetch, 500);
      })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);`;

code = code.replace(target, replacement);
fs.writeFileSync('src/store.tsx', code);
