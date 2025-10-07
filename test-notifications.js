// =====================================================
// SCRIPT DE PRUEBA PARA NOTIFICACIONES
// =====================================================

// Este script se puede ejecutar en la consola del navegador para probar las notificaciones

console.log('🚀 Iniciando pruebas de notificaciones...');

// Función para crear una notificación de prueba
async function createTestNotification() {
  try {
    console.log('📝 Creando notificación de prueba...');
    
    // Obtener usuario actual
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('❌ Error de autenticación:', authError);
      return;
    }

    // Crear notificación de prueba
    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        user_id: user.id,
        type: 'admin_message',
        title: 'Notificación de prueba',
        message: 'Esta es una notificación de prueba creada desde la consola.',
        data: {
          test: true,
          timestamp: new Date().toISOString(),
          source: 'console_test'
        }
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creando notificación:', error);
    } else {
      console.log('✅ Notificación creada exitosamente:', data);
    }
  } catch (error) {
    console.error('❌ Error inesperado:', error);
  }
}

// Función para marcar todas las notificaciones como leídas
async function markAllAsRead() {
  try {
    console.log('📖 Marcando todas las notificaciones como leídas...');
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('❌ Error de autenticación:', authError);
      return;
    }

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) {
      console.error('❌ Error marcando como leídas:', error);
    } else {
      console.log('✅ Todas las notificaciones marcadas como leídas');
    }
  } catch (error) {
    console.error('❌ Error inesperado:', error);
  }
}

// Función para obtener estadísticas de notificaciones
async function getNotificationStats() {
  try {
    console.log('📊 Obteniendo estadísticas de notificaciones...');
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('❌ Error de autenticación:', authError);
      return;
    }

    // Obtener todas las notificaciones
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error obteniendo notificaciones:', error);
      return;
    }

    // Calcular estadísticas
    const stats = {
      total: notifications.length,
      unread: notifications.filter(n => !n.is_read).length,
      read: notifications.filter(n => n.is_read).length,
      byType: {}
    };

    // Contar por tipo
    notifications.forEach(notification => {
      if (!stats.byType[notification.type]) {
        stats.byType[notification.type] = { total: 0, unread: 0 };
      }
      stats.byType[notification.type].total++;
      if (!notification.is_read) {
        stats.byType[notification.type].unread++;
      }
    });

    console.log('📈 Estadísticas de notificaciones:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Error inesperado:', error);
  }
}

// Función para simular cambios de estado de orden
async function simulateOrderStatusChange(orderId, newStatus) {
  try {
    console.log(`🔄 Simulando cambio de estado de orden ${orderId} a ${newStatus}...`);
    
    // Obtener la orden actual
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('❌ Error obteniendo orden:', orderError);
      return;
    }

    // Actualizar el estado
    const { data, error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error actualizando orden:', error);
    } else {
      console.log('✅ Estado de orden actualizado:', data);
      console.log('📢 Se debería crear una notificación automáticamente');
    }
  } catch (error) {
    console.error('❌ Error inesperado:', error);
  }
}

// Función para verificar configuración de realtime
async function checkRealtimeConfig() {
  try {
    console.log('🔍 Verificando configuración de realtime...');
    
    // Verificar que podemos conectarnos al canal
    const channel = supabase.channel('test-channel');
    
    channel
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications'
      }, (payload) => {
        console.log('🔔 Evento de realtime recibido:', payload);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime configurado correctamente');
        } else {
          console.log('⚠️ Estado de realtime:', status);
        }
      });

    // Limpiar después de 5 segundos
    setTimeout(() => {
      supabase.removeChannel(channel);
      console.log('🧹 Canal de prueba cerrado');
    }, 5000);

  } catch (error) {
    console.error('❌ Error verificando realtime:', error);
  }
}

// Función principal de pruebas
async function runAllTests() {
  console.log('🧪 Ejecutando todas las pruebas...');
  
  // 1. Verificar configuración
  await checkRealtimeConfig();
  
  // 2. Obtener estadísticas iniciales
  await getNotificationStats();
  
  // 3. Crear notificación de prueba
  await createTestNotification();
  
  // 4. Esperar un poco para que se procese
  setTimeout(async () => {
    // 5. Obtener estadísticas después de crear
    await getNotificationStats();
    
    console.log('✅ Pruebas completadas. Revisa la UI para ver los cambios.');
  }, 2000);
}

// Exportar funciones para uso manual
window.notificationTests = {
  createTestNotification,
  markAllAsRead,
  getNotificationStats,
  simulateOrderStatusChange,
  checkRealtimeConfig,
  runAllTests
};

console.log(`
🎯 Funciones de prueba disponibles:

- notificationTests.createTestNotification()     // Crear notificación de prueba
- notificationTests.markAllAsRead()              // Marcar todas como leídas
- notificationTests.getNotificationStats()       // Ver estadísticas
- notificationTests.simulateOrderStatusChange()  // Simular cambio de orden
- notificationTests.checkRealtimeConfig()        // Verificar realtime
- notificationTests.runAllTests()                // Ejecutar todas las pruebas

Ejemplo de uso:
notificationTests.runAllTests()
`);

// Ejecutar pruebas automáticamente si se desea
// notificationTests.runAllTests();


