import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Loga o evento recebido (pode salvar em banco, fila, etc)
    console.log("Webhook recebido do Pipedrive:", JSON.stringify(body, null, 2));

    // Aqui você pode processar o evento conforme sua necessidade
    // Exemplo: salvar no banco, disparar notificações, etc.

    // Retorne uma resposta rápida para o Pipedrive
    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao processar webhook" }, { status: 500 });
  }
} 